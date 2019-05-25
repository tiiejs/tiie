/** @module Tiie/Router */
import TiieObject from 'Tiie/Object';

import clone from 'Tiie/Utils/merge';

const cn = 'Router';

class Router extends TiieObject {
    constructor() {
        super();

        let p = this.__private(cn, {
            routes : [],
            dispatch : 1,
            history : [],
        });
    }

    /**
     * Runs the router.
     *
     * @return {this}
     */
    run() {
        let p = this.__private(cn);

        if ("onhashchange" in window) {
            window.onhashchange = () => {
                if (p.dispatch) {
                    this._process();
                }
            };
        }else{
            // todo
            // setInterval(this._process.bind(this), 1000);
        }

        // Dispatch na poczatek
        this._process();

        return this;
    }

    /**
     * Redirect to specific resource. There are two way of redirect. At first
     * you can give direct urn. Second you give object with define action and
     * params.
     *
     * @param {string|object} to
     * @return {this}
     */
    redirect(to) {
        let p = this.__private(cn);

        if (typeof(to) == "string") {
            this._urn(this._decode(to), {route : 1})

            return this;
        } else if (typeof(to) == "object"){
            let decoded = this._decode(this.urn());

            to.action = to.action ? to.action : decoded.action;
            to.params = to.params ? to.params : decoded.params;

            this._urn(to, {route : 1});

            return this;
        }
    }

    urn() {
        let p = this.__private(cn),
            hash = window.location.hash
        ;

        if(hash == "") {
            return "/";
        }

        if(hash[0] == "#") {
            if(hash[1] == "/") {
                return hash.substring(1);
            } else {
                return `/${hash.substring(1)}`;
            }
        } else {
            return hash;
        }
    }

    /**
     * Sets the page title.
     *
     * @param {string} title
     * @return {this|string}
     */
    title(title) {
        const p = this.__private(cn);

        if (title == undefined) {
            return document.title;
        } else {
            document.title = title;

            // Set title for history.
            p.history[p.history.length - 1].title = title;

            return this;
        }
    }

    /**
     * Add new route.
     *
     * @param {object} route
     * @return this
     */
    addRoute(route) {
        let p = this.__private(cn);

        route.alias = route.alias === undefined ? null : route.alias;
        route.type = route.type === undefined ? Router.ROUTE_TYPE_ROUTE : route.type;
        route.action = route.action === undefined ? null : route.action;

        if (route.alias === null) {
            if (route.type == Router.ROUTE_TYPE_ERROR) {
                route.alias = 'error';
            }else if(route.type == Router.ROUTE_TYPE_INDEX) {
                route.alias = 'index';
            }else if(route.type == Router.ROUTE_TYPE_NOT_FOUND) {
                route.alias = 'notFound';
            }
        }

        p.routes.push(route);

        return this;
    }

    routes(routes) {
        let p = this.__private(cn);

        return p.routes;
    }

    /**
     * Open new tab.
     *
     * this.newTab('')
     */
    // newTab(action, params = {}, focus = 0) {
    /**
     * Open new tab.
     *
     * @param {string|object} to
     * @param {object} [params]
     *
     * @return this
     */
    newTab(to, params = {}) {
        let p = this.__private(cn),
            url = null
        ;

        params.remote = params.remote ? params.remote : 0;

        if(typeof(to) == "string") {
            url = to;
        } else if (typeof(to) == "object") {
            let decoded = this._decode(this.urn());

            to.action = to.action ? to.action : decoded.action;
            to.params = to.params ? to.params : decoded.params;

            url = this._encode(to);
        }

        if(params.remote == 0) {
            url = `#${url}`;
        }

        if (focus) {
            window.open(url, '_blank').focus();
        }else{
            window.open(url, '_blank');
        }

        return this;
    }

    event(urn, event, params = {}) {
        if (event.event != undefined) {
            event = event.event;
        }

        if (event.ctrlKey) {
            this.newTab(urn, params);
        }else{
            this.redirect(urn, params);
        }

        return this;
    }

    _decode(urn) {
        let p = this.__private(cn),
            decoded = {}
        ;

        let splited = urn.split('?');

        if (splited.length == 1) {
            decoded.action = splited[0];
            decoded.params = {};
        }else{
            decoded.action = splited[0];
            decoded.params = this._deserializeParams(splited[1]);
        }

        if(decoded.action[0] == "@") {
            // Find alias
            let route = this._findRoute(decoded.action);

            decoded.action = route.action;
        }

        return decoded;
    }

    _encode(data = {}) {
        let p = this.__private(cn),
            action = data.action ? data.action : "",
            params = this._serializeParams(data.params ? data.params : {})
        ;

        if(action[0] != "/") {
            action = `/${action}`;
        }

        if(params) {
            return `${action}?${params}`;
        } else {
            return action;
        }
    }

    /**
     * Metoda przeszukuje wszystkie trasy i zwraca tą która odpowiada podanego
     * URN.
     *
     * @param {string} action
     * @return {object} Trasa pasująca do podanego URN
     */
    _findRoute(action) {
        let p = this.__private(cn),
            route
        ;

        if (action[0] == '@') {
            // Szukamy po aliasie
            let alias = action.substring(1);

            route = p.routes.find((route) => {
                return route.alias == alias;
            });

            if (route !== undefined) {
                return route;
            }
        }

        // Szukam po urn
        if(action == "/"){
            route = p.routes.find((route) => route.type == Router.ROUTE_TYPE_INDEX);
        }else{
            route = p.routes.find((route) => route.action == action);
        }

        if (route === undefined) {
            // Nie znaleziono routa, szukam notFound
            route = p.routes.find((route) => route.type == Router.ROUTE_TYPE_NOT_FOUND);

            if (route === undefined) {
                throw("Route ROUTE_TYPE_NOT_FOUND is not defined.");
            }
        }

        return route;
    }

    /**
     * Wykonuje wewnętrzne przekerowanie. Pierwszą różnicą w porównaniu do go()
     * jest to, że nie jest zmieniany link w oknie przeglądarki. Drugą różnicą
     * jest to, że możliwe jest przekazanie w parametrach obiektów w nie tylko
     * danych. Wynika to stąd, że w przypadku metody go(), parametry sa
     * kodowane do linka.
     *
     * @param {string} action
     * @param {object} params
     * @return this
     */
    forward(action, params) {
        let p = this.__private(cn),
            route = this._findRoute(action)
        ;

        route.execute.call(this, params, route);

        return this;
    }

    _urn(data, params = {}) {
        let p = this.__private(cn);

        params.route = params.route ? params.route : 0;

        data.action = data.action ? data.action : "";
        data.params = data.params ? data.params : {};

        let encoded = this._encode(data);

        if(params.route) {
            window.location.hash = `#${encoded}`;
        } else {
            p.dispatch = 0;

            window.location.hash = `#${encoded}`;

            setTimeout(() => {
                p.dispatch = 1;
            }, 500);
        }

        return this;
    }

    _historyAppend(urn) {
        let p = this.__private(cn),
            decoded = this._decode(urn),
            route = this._findRoute(decoded.action),
            id = `id${p.history.length+1}`
        ;

        if(route.type == Router.ROUTE_TYPE_ERROR) {
            return;
        }

        if(p.history.length) {
            if(p.history[p.history.length - 1].urn != urn) {
                p.history.push({
                    id,
                    urn,
                    title : null,
                });
            }
        } else {
            p.history.push({
                id,
                urn,
                title : null,
            });
        }
    }

    history() {
        let p = this.__private(cn);

        return p.history;
    }

    _process() {
        let p = this.__private(cn),
            urn = this.urn(),
            decoded = this._decode(urn),
            route = this._findRoute(decoded.action)
        ;

        this._historyAppend(urn);

        route.execute.call(this, decoded.params, route);

        return this;
    }

    _serializeParams(params) {
        if (Object.keys(params).length == 0) {
            return null;
        }

        // return encodeURI(btoa(JSON.stringify(params)));
        return btoa(JSON.stringify(params));

        // let p = this.__private(cn);
        // let serialized = "";

        // for (let name in params) {
        //     if (params[name] == null || params[name] === undefined) {
        //         continue;
        //     }

        //     if (Array.isArray(params[name])) {
        //         if (params[name].length == 0) {
        //             continue;
        //         }
        //     }

        //     serialized = serialized + "&" + name + "=" + encodeURIComponent(params[name]);
        // }

        // if (serialized == "") {
        //     return null;
        // }else{
        //     return serialized;
        //     // return encodeURIComponent(serialized.substr(1));
        // }
    }

    _deserializeParams(serialized) {
        // return JSON.parse(atob(decodeURI(serialized)));
        return JSON.parse(atob(serialized));

        // let p = this.__private(cn);
        // serialized = serialized.trim();

        // if (serialized == "") {
        //     return {};
        // }

        // serialized = decodeURIComponent(serialized);

        // let params = {},
        //     temp,
        //     i,
        //     l
        // ;

        // let elements = serialized.split("&");

        // for (i = 0, l = elements.length; i < l; i++ ) {
        //     temp = elements[i].split('=');
        //     params[temp[0]] = temp[1];
        // }

        // return params;
    }

    /**
     * Set value of param or returns value.
     *
     * @param {string} name
     * @param {string} value
     * @param {object} params
     *
     * @return {this|string}
     */
    param(...args) {
        let p = this.__private(cn),
            params = this.params()
        ;

        if(args.length == 1) {
            // router.param("name");
            return params[args[0]] == undefined ? null : params[args[0]];
        } else if(args.length == 2) {
            // router.param("name", value);
            params[args[0]] = args[1];

            this.params(params);

            return this;
        } else if(args.length == 3) {
            // router.param("name", value);
            params[args[0]] = args[1];

            this.params(params, args[2]);

            return this;
        } else {
            this.__log(`Unsported number of params.`, "notice", "Tiie.Router.Router::param");

            return this;
        }
    }

    /**
     * Set or return params.
     *
     * @example
     * router.params();
     * router.params({id : 10});
     * router.params({id : 10}, {route : 1});
     *
     * @param {object} [values]
     * @param {object} [params]
     *
     * @return {object|this}
     */
    params(...args) {
        let p = this.__private(cn),
            // Decode present state of params.
            decoded = this._decode(this.urn())
        ;

        if(args.length == 0) {
            // Return params.
            return decoded.params;
        } else if(args.length == 1) {
            // Set values of params.

            Object.keys(args[0]).forEach((key) => {
                decoded.params[key] = args[0][key];
            });

            this._urn(decoded);

            return this;
        } else if(args.length == 2) {
            let merge = args[1].merge != undefined ? args[1].merge : 1;

            if(merge) {
                Object.keys(args[0]).forEach((key) => {
                    decoded.params[key] = args[0][key];
                });
            } else {
                decoded.params = args[0];
            }

            this._urn(decoded, args[1]);

            return this;
        } else {
            this.__log(`Unsported number of params.`, "notice", "Tiie.Router.Router::params");

            return this;
        }
    }

    /**
     * Set or return present action for router.
     *
     * @param {string} [value]
     * @param {object} [params]
     *
     * @return {this|string}
     */
    action(...args) {
        let p = this.__private(cn),
            decoded = this._decode(this.urn())
        ;

        if(args.length == 0) {
            return decoded.action;
        } else if(args.length == 1) {
            // Set values of params.
            decoded.action = args[0];

            this._urn(decoded);

            return this;
        } else if(args.length == 2) {
            // Set values of params.
            decoded.action = args[0];

            this._urn(decoded, args[1]);

            return this;
        } else {
            this.__log(`Unsported number of params.`, "notice", "Tiie.Router.Router::action");

            return this;
        }
    }
}

Router.ROUTE_TYPE_ROUTE = 'route';
Router.ROUTE_TYPE_INDEX = 'index';
Router.ROUTE_TYPE_NOT_FOUND = 'notFound';
Router.ROUTE_TYPE_ERROR = 'error';

export default Router;
