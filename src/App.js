/** @module Tiie */
import TiieObject from "Tiie/Object";
import Components from "Tiie/Components";
import Config from "Tiie/Config";
import Router from "Tiie/Router/Router";
import UtilsArray from 'Tiie/Utils/Array';

import Window from "Tiie/Window/Window";
import global from "Tiie/global";
import merge from "Tiie/Utils/merge";

let components = {
    '@utils.array' : function(components, params = {}) {
        return new UtilsArray();
    },
    '@window' : function(components, params = {}) {
        return new Window();
    },
    '@router' : function(components, params = {}) {
        let router = new Router(),
            config = components.get('@config'),
            app = components.get('@app')
        ;

        let routes = config.get("router").routes;

        router.routes(routes.map((route) => {
            if (route.execute === undefined) {
                if (route.controllerClass === undefined || route.actionClass === undefined) {
                    throw(`Route needs to be defined controllerClass and actionClass`);
                }

                route.execute = (params, route) => {
                    app.action(route.controllerClass, route.actionClass, params);
                }
            }

            return route;
        }));

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
            actions : [],
            controller : null,
            action : null,
            components : null,
            target,
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
    run() {
        let p = this.__private(cn);

        this.component('@router').run();
    }

    plugin(extension) {
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
        let p = this.__private(cn);

        extension(this);

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
            controller = p.controllers.find(element => element.class == controllerClass),
            action = p.actions.find(element => element.class == actionClass),
            promises = []
        ;

        if (controller == undefined) {
            controller = {
                instance : new controllerClass(p.components),
                class : controllerClass
            };

            promises.push(controller.instance.run(params));

            if (p.controller) {
                // Przy zmianie kontrolera, usypiam poprzedni kontroler
                promises.push(p.controller.sleep());
            }

            p.controller = controller.instance;
            p.controllers.push(controller);
        } else {
            if (p.controller !== controller.instance) {
                promises.push(p.controller.sleep());
                promises.push(controller.instance.wakeup());

                p.controller = controller.instance;
            }
        }

        if (action == undefined) {
            action = {
                instance : new actionClass(p.components),
                class : actionClass
            };

            promises.push(action.instance.run(params));

            if (p.action) {
                promises.push(p.action.sleep());
            }

            p.action = action.instance;
            p.actions.push(action);
        } else {
            if (p.action !== action.instance) {
                promises.push(p.action.sleep());
                promises.push(action.instance.wakeup());

                p.action = action.instance;
            }
        }

        Promise.all(promises).then(() => {
            return Promise.all([
                p.controller.reload(params),
                p.action.reload(params),
            ]);
        }).then(() => {
            p.controller.view().target(p.target);
            p.action.view().target(p.controller.view().element('content'));
        }).catch((error) => {
            console.log('error', error);
        });
    }
};

export default App;
