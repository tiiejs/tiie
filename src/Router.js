import TopiObject from 'Topi/Object';

import clone from 'Topi/Utils/merge';

const cn = 'Router';
class Router extends TopiObject {
    constructor() {
        super();

        let p = this.private(cn, {
            routes : [],
            silently : 0,
            dispatch : 1,
        });
    }

    run() {
        let p = this.private(cn);

        if ("onhashchange" in window) {
            window.onhashchange = () => {
                if (p.dispatch) {
                    this._dispatch(this.urn());
                }
            };
        }else{
            // todo
            // setInterval(this._dispatch.bind(this), 1000);
        }

        // Dispatch na poczatek
        this._dispatch(this.urn());
    }

    /**
     * Add new route.
     *
     * @param {object} route
     * @return this
     */
    route(route) {
        let p = this.private(cn);

        route = clone(route);

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
        let p = this.private(cn);

        routes.forEach((route) => {
            this.route(route);
        });

        return this;
    }

    /**
     * Open new tab.
     *
     * this.newTab('')
     */
    newTab(action, params = {}, focus = 0) {
        let p = this.private(cn),
            serializedParams = this._serializeParams(params),
            taction
        ;

        if (serializedParams == null) {
            taction = "#/" + action;
        }else{
            taction = "#/" + action + "?" + serializedParams;
        }

        if (focus) {
            window.open(taction, '_blank').focus();
        }else{
            window.open(taction, '_blank');
        }

        return this;
    }

    event(action, event, params= {}) {
        if (event.event != undefined) {
            event = event.event;
        }

        if (event.ctrlKey) {
            this.newTab(action, params);
        }else{
            this.go(action, params);
        }

        return this;
    }

    go(action, params = {}) {
        this.urn(action, params, {route : 1});

        return this;
    }

    /**
     * Metoda zwraca aktualnie ustawiona akcję w linku. Za pomoca metody można
     * również ustawić akcje.
     *
     * @param {string} action
     * @param {object} paramsin
     *
     * @return {string|this}
     */
    action(action, paramsin = {}) {
        let p = this.private(cn),
            t
        ;

        paramsin.route = paramsin.route === undefined ? 0 : paramsin.route;

        if (action === undefined) {
            return this._parseUrn().action;
        }else{
            this.urn(action, this._parseUrn().paramsin, paramsin);

            return this;
        }
    }

    /**
     * Ustawia wartość dla wybranego parametru. Lub zwraca wartość podanego
     * parametru.
     *
     * @param {string} name
     * @param {string} value
     * @param {object} paramsin
     * @return {this|string|null}
     */
    param(name, value, paramsin = {}) {
        let p = this.private(cn),
            parsed = this._parseUrn().params
        ;

        if (value === undefined) {
            if (parsed[name] != undefined) {
                return parsed[name];
            }else{
                return null;
            }
        }else{
            parsed[name] = value;

            return this.params(parsed, paramsin);
        }
    }

    /**
     * Zwraca lub ustawia wartości wszystkich parametrów.
     *
     * @param {string} params
     * @param {object} paramsin
     * @return this|{object}
     */
    params(params, paramsin = {}) {
        let p = this.private(cn);

        paramsin.route = paramsin.route || 0;
        paramsin.clean = paramsin.clean || 0;

        if (params === undefined) {
            return this._parseUrn().params;
        }else{
            if (paramsin.clean) {
                this.urn(this._parseUrn().action, params, paramsin);
            }else{
                let parsed = this._parseUrn();

                for (let i in params) {
                    parsed.params[i] = params[i];
                }

                return this.urn(parsed.action, parsed.params, paramsin);
            }
        }

        this.log("Unsported params.", "warn");

        return this;
    }

    _parseUrn(urn) {
        let p = this.private(cn),
            read = {},
            splited
        ;

        if (urn === undefined) {
            read.urn = window.location.hash;
        }else{
            read.urn = urn;
        }

        if (read.urn == "") {
            read.urn = "/";
        }else if (read.urn[1] != "/") {
            read.urn = "/" + read.urn.substr(1);
        }else{
            read.urn = read.urn.substr(1);
        }

        splited = read.urn.split('?');

        if (splited.length == 1) {
            read.action = splited[0];
            read.params = {};
        }else{
            read.action = splited[0];
            read.params = this._deserializeParams(splited[1]);
        }

        return read;
    }

    /**
     * Metoda przeszukuje wszystkie trasy i zwraca tą która odpowiada podanego
     * URN.
     *
     * @param {string} action
     * @return {object} Trasa pasująca do podanego URN
     */
    _findRoute(action) {
        let p = this.private(cn),
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
        let p = this.private(cn),
            route = this._findRoute(action)
        ;

        route.execute.call(this, params, route);

        return this;
    }

    urn(action, params, paramsin = {}) {
        let p = this.private(cn),
            t
        ;

        paramsin.route = paramsin.route === undefined ? 0 : paramsin.route;

        if (action === undefined && params === undefined) {
            return this._parseUrn().urn;
        }else{
            // Szukam trasy na postawie URN
            let route = this._findRoute(action);

            // Pobieram URN z sciezki
            action = route.action;

            // Serializuje parametry
            params = this._serializeParams(params);

            if (params == null) {
                // Nie mamy parametrów
                action = '#' + action;
            }else{
                action = '#' + action + '?' + params;
            }

            if (paramsin.route) {
                window.location.hash = action;
            }else{
                p.dispatch = 0;

                setTimeout(function() {
                    p.dispatch = 1;
                }, 500);

                window.location.hash = action;
            }

            return this;
        }
    }

    _dispatch(urn) {
        let p = this.private(cn),
            parsed = this._parseUrn(urn)
        ;

        let route = this._findRoute(parsed.action);

        route.execute.call(this, parsed.params, route);

        return this;
    }

    _serializeParams(params) {
        if (Object.keys(params).length == 0) {
            return null;
        }

        return btoa(unescape(encodeURIComponent(JSON.stringify(params))));

        let p = this.private(cn);
        let serialized = "";

        for (let name in params) {
            if (params[name] == null || params[name] === undefined) {
                continue;
            }

            if (Array.isArray(params[name])) {
                if (params[name].length == 0) {
                    continue;
                }
            }

            serialized = serialized + "&" + name + "=" + encodeURIComponent(params[name]);
        }

        if (serialized == "") {
            return null;
        }else{
            return serialized;
            // return encodeURIComponent(serialized.substr(1));
        }
    }

    _deserializeParams(serializedParams) {
        // return JSON.parse(decodeURIComponent(escape(atob(serializedParams))));
        return JSON.parse(decodeURIComponent(atob(serializedParams)));

        let p = this.private(cn);
        serializedParams = serializedParams.trim();

        if (serializedParams == "") {
            return {};
        }

        serializedParams = decodeURIComponent(serializedParams);

        let params = {},
            temp,
            i,
            l
        ;

        let elements = serializedParams.split("&");

        for (i = 0, l = elements.length; i < l; i++ ) {
            temp = elements[i].split('=');
            params[temp[0]] = temp[1];
        }

        return params;
    }
}

Router.ROUTE_TYPE_ROUTE = 'route';
Router.ROUTE_TYPE_INDEX = 'index';
Router.ROUTE_TYPE_NOT_FOUND = 'notFound';
Router.ROUTE_TYPE_ERROR = 'error';

export default Router;
