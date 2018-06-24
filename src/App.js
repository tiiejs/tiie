import TopiObject from "Topi/Object";
import Components from "Topi/Components";
import Config from "Topi/Config";
import Dialog from "Topi/Dialog/Dialog";
import Router from "Topi/Router";
import UtilsArray from 'Topi/Utils/Array';

import global from "Topi/global";
import merge from "Topi/Utils/merge";

let components = {
    '@dialog' : function(components, params = {}) {
        return new Dialog();
    },
    '@utils.array' : function(components, params = {}) {
        return new UtilsArray();
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
                    app.action(route.actionClass, params, route.controllerClass);
                };
            }

            return route;
        }));

        return router;
    },
};

const cn = 'App';
class App extends TopiObject {
    constructor(target, config = {}) {
        super();

        let p = this.private(cn, {
            config : new Config(config),
            controller : null,
            action : null,
            target,
        });

        let componentsConfig = p.config.get("components");

        // components
        components = merge(components, componentsConfig.components);

        components = new Components(components);

        components.set('@config', p.config);
        components.set('@app', this);

        global.components = components;

        // set components to main TopiObject
        TopiObject.components(components);
    }

    run() {
        let p = this.private(cn);

        this.component('@router').run();
    }

    target() {
        let p = this.private(cn);

        return p.target;
    }

    /**
     * Run action
     */
    action(action, params, controller) {
        let p = this.private(cn);

        // Czy controller powinien decytowac o sposobie uruchomienia akcji
        if (p.controller === null) {
            p.controller = new controller(p.target, p.components);
            p.controller.run().then(() => {
                p.controller.action(action, params);
            });
        }else if(p.controller instanceof controller){
            p.controller.action(action, params);
            // p.action.end().then(() => {
            //     p.action = new action(p.components);
            //     p.action.run(params, p.controller).then(() => {

            //     });
            // });
        }else{
            p.controller.end().then(() => {
                p.controller = new controller(p.target, p.components);
                p.controller.run(params).then(() => {
                    p.controller.action(action, params);
                    // p.action = new action(p.components);
                    // p.action.run(params, p.controller).then(() => {

                    // });
                });
            });
        }
    }
};

export default App;
