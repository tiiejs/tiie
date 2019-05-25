/** @module Tiie */
import TiieObject from "Tiie/Object";
import Components from "Tiie/Components";
import Config from "Tiie/Config";
import Icons from "Tiie/Icons";
import Router from "Tiie/Router/Router";
import UtilsArray from 'Tiie/Utils/Array';
import Responsive from "Tiie/Responsive";
import EnvironmentService from "Tiie/Environment/Service";
import Intervals from "Tiie/Intervals";

import Window from "Tiie/Window/Window";
import global from "Tiie/global";
import merge from "Tiie/Utils/merge";

let components = {
    "@utils.array" : function(components, params = {}) {
        return new UtilsArray();
    },
    "@window" : function(components, params = {}) {
        return new Window();
    },
    "@icons" : function(components, params = {}) {
        return new Icons();
    },
    "@environment" : function(components, params = {}) {
        return new EnvironmentService();
    },
    "@intervals" : function(components, params = {}) {
        return new Intervals();
    },
    "@responsive" : function(components, params = {}) {
        return new Responsive();
    },
    "@router" : function(components, params = {}) {
        let router = new Router(),
            config = components.get('@config'),
            app = components.get('@app')
        ;

        let routes = config.get("router").routes;

        routes.forEach((route) => {
            if (route.execute === undefined) {
                if(route.controllerClass == undefined || route.actionClass == undefined) {
                    app.log("Each route needs to have defined 'controllerClass' and 'actionClass'.", "warning");
                } else {
                    route.execute = (params, route) => {
                        app.action(route.controllerClass, route.actionClass, params);
                    }

                    router.addRoute(route);
                }
            }

        });

        return router;
    },
};

const cn = 'App';

/**
 * The main class representing the application.
 *
 * @param {jQuery} target Target for application.
 * @param {object} config
 *
 * @class
 * @example
 * let app = window.app = new App(jQuery("body"), {});
 *
 * // Some plugins
 * app.plugin(extensionFrames);
 * app.plugin(extensionNotifications);
 * app.plugin(extensionLoader);
 * app.plugin(extensionApi);
 * app.plugin(extensionStyles);
 *
 * app.run();
 */
class App extends TiieObject {
    constructor(target, config = {}) {
        super();

        let p = this.__private(cn, {
            config : new Config(config),
            controllers : [],
            // actions : [],

            // Last controller and action
            controller : null,
            action : null,

            components : null,
            target,
            params : {},
        });

        let componentsConfig = p.config.get("components");

        // Components
        components = merge(components, componentsConfig.components);

        p.components = new Components(components);

        p.components.set('@config', p.config);
        p.components.set('@app', this);

        global.components = p.components;

        // set components to main TiieObject
        TiieObject.components(p.components);
    }

    /**
     * Run the application.
     *
     * @access public
     * @return {this}
     */
    run(params = {}) {
        let p = this.__private(cn);

        p.params = params;

        this.__component('@router').run();

        return this;
    }

    /**
     * Plugin external extensions.
     *
     * @param {function} extension
     * @param {object} params
     *
     * @access public
     * @return {this}
     *
     * @example
     * let app = window.app = new App(jQuery("body"));
     *
     * app.plugin(extensionFrames);
     * app.plugin(extensionNotifications);
     * app.plugin(extensionLoader);
     * app.plugin(extensionApi);
     * app.plugin(extensionStyles);
     *
     * app.run();
     */
    plugin(extension, params) {
        let p = this.__private(cn);

        extension(this, params);

        return this;
    }

    /**
     * Returns reference to main container of application. For example It can
     * be "body".
     *
     * @access public
     * @return {jQuery}
     */
    target() {
        let p = this.__private(cn);

        return p.target;
    }

    /**
     * Return reference to components.
     *
     * @public
     * @return {Tiie.Components}
     */
    components() {
        let p = this.__private(cn);

        return p.components;
    }

    /**
     * Run action
     */
    action(controllerClass, actionClass, params) {
        let p = this.__private(cn),
            // Check if controller exists.
            // controller = p.controllers.find(element => element.class == controllerClass),

            // Check if action exists
            // action = p.actions.find(element => element.class == actionClass),
            promises = []
        ;

        // 1. Kontroller nie istnieje, inicjuje kontroller
        //    - uchomomienie (run)
        //    - przygotowanie (prepare)
        //    - aktualizacja (update)
        //
        // 2. Kontroller istnieje, ale sie zmienił.
        //    Poprzedni
        //    - przygotowanie (sleep)
        //
        //    Nowy
        //    - przygotowanie (wakeup)
        //    - przygotowanie (prepare)
        //    - aktualizacja (update)
        //
        // 3. Kontroller istnieje, i jest taki sam.
        //    - aktualizacja (update)
        //
        // 1. Akcja nie istnieje, inicjuje akcje
        //    - run
        //    - ? reload
        //    - update
        //
        // 2. Akcja istnieje i jest taka sama
        //    - ? reload
        //    - update

        // todo
        p.components.get("@intervals").clean(Intervals.SCOPE_ACTION);

        if(p.controller == null) {
            p.controller = {
                instance : new controllerClass(p.components),
                class : controllerClass
            };

            // Run controller.
            promises.push(p.controller.instance.run(params));
        } else {
            if(p.controller.class != controllerClass) {
                p.components.get("@intervals").clean(Intervals.SCOPE_CONTROLLER);

                p.controller = {
                    instance : new controllerClass(p.components),
                    class : controllerClass
                };

                promises.push(p.controller.instance.run(params));
            }
        }

        if (p.action == null) {
            p.action = {
                instance : new actionClass(p.components),
                class : actionClass
            };

            promises.push(
                Promise.resolve()
                .then(() => {
                    return p.controller.instance.prepare(params);
                })
                .then(() => {
                    return p.action.instance.run(params, p.controller.instance);
                })
            );

            // promises.push(p.action.instance.run(params, p.controller.instance));
        } else {
            if(p.action.class != actionClass) {
                p.action = {
                    instance : new actionClass(p.components),
                    class : actionClass
                };

                // First call prepare then run
                promises.push(
                    Promise.resolve()
                    .then(() => {
                        return p.controller.instance.prepare(params);
                    })
                    .then(() => {
                        return p.action.instance.run(params, p.controller.instance);
                    })
                );
            }
        }

        Promise.all(promises).then(() => {

        }).then(() => {
            return p.controller.instance.update(params);
        }).then(() => {
            return p.action.instance.update(params);
        }).then(() => {
            p.controller.instance.view().target(p.target);
        }).catch((error) => {
            console.log('error', error);
        });
    }
};

export default App;
