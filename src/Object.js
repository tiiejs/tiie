import same from "Tiie/Utils/same";
import clone from "Tiie/Utils/clone";
import boolean from "Tiie/Utils/boolean";

let uniqueId = 0,
    components = null
;

/**
 * EventsQueue
 */
class EventsQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }

    add(callback, event = {}, params = {}) {
        this.queue.push({
            callback,
            event,
            params,
        });

        this._process();
    }

    _process() {
        if (this.processing) {
            return;
        }

        this.processing = true;

        let event;

        while(this.queue.length) {
            event = this.queue.shift();
            event.callback.call(window, event.event, event.params);
        }

        this.processing = false;
    }
}

let eventsQueue = new EventsQueue();

const cn = "TiieObject";

/**
 * TiieObject
 */
class TiieObject {

    __destruct() {}
    __clone() {}

    async __sync() {return Promise.resolve()}

    constructor(data = {}) {
        let p = this.__private(cn, {
            definitions : {
                dataStructure : {},
            },

            // Eventy
            events : {},

            // Dane obiektu
            data,

            syncingWaiting : [],
            syncing : null,
        });

        // State variables
        p.data["@destroyed"] = 0;
        p.data["@visible"] = 0;
    }

    __initState(definition, data = {}) {
        let p = this.__private(cn), value;

        this.__define("data.structure", definition);

        Object.keys(data).forEach((name) => {
            if (definition.hasOwnProperty(name)) {
                this.set(name, data[name], {silently : 1});
            }
        });
    }

    /**
     * Allows to define some attributes of object.
     *
     * @param {string} name
     * - data.structure - allows to set define structure of data. Structure of
     *   data contains information about types, values, default value etc.
     *
     * @param {object} definition
     * @return {this}
     */
    __define(name, definition = {}) {
        let p = this.__private(cn), value;

        if (name == "data.structure") {
            Object.keys(definition).forEach((name) => {
                p.definitions.dataStructure[name] = definition[name];

                if (definition[name].hasOwnProperty("value")) {
                    this.set(name, definition[name]["value"], {silently : 1});
                } else if(definition[name].hasOwnProperty("default")) {
                    this.set(name, definition[name]["default"], {silently : 1});
                }
            });
        } else {
            this.log(`Unsuported type to define '${name}.'`, "notice", "Tiie.Object");
        }

        return this;
    }

    /**
     * Sync object data with remte resource.
     *
     * @return {Promise}
     */
    async sync() {
        let p = this.__private(cn);

        if (this.is("@syncing")) {
            return p.syncing.then();
        }

        this.set("@syncing", 1);

        return p.syncing = this.__sync().then((data) => {
            // Set data at syncing mode.
            this.set("@synced", 1, {syncing : 1});

            Object.keys(data).forEach((key) => {
                this.set(key, data[key], {syncing : 1});
            });

            this.set("@syncing", 0, {syncing : 1});

            p.syncing = null;

            syncingWaiting.call(this, p);
        }).catch((data) => {
            this.set("@syncing", 0, {syncing : 1});
            this.set("@synced", 1, {syncing : 1});

            p.syncing = null;

            syncingWaiting.call(this, p);
        });
    }

    destroy() {
        let p = this.__private(cn);

        this.__destruct();

        this.set("@destroyed", 1);

        return this;
    }

    clone() {
        return this.__clone();
    }

    __empty(value) {
        if (value == null || value == undefined) {
            return 1;
        }

        if (Array.isArray(value) && value.length == 0) {
            return 1;
        }

        if (value == "" || value == 0) {
            return 1;
        }

        if (typeof value == "object" && Object.keys(value).length == 0) {
            return 1;
        }

        return 0;
    }

    __boolean(value) {
        if (value == "0") {
            return 0;
        } else {
            if (value) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    warn(message) {
        console.warn(message);

        return this;
    }

    error(error) {
        let p = this.__private(cn),
            router = this.component("@router")
        ;

        router.forward("@error", {error});

        return this;
    }

    log(message, type = "log", tag = null) {
        if (tag != null) {
            tag = `[${tag}] `;
        } else {
            tag = "";
        }

        switch (type) {
            case "error":
                return this.error(`${tag}${message}`);
            case "warn":
                console.warn(`${tag}${message}`);
                break;
            case "notice":
                console.log(`${tag}${message}`);
                break;
            case "log":
                console.log(`${tag}${message}`);
                break;
            case "debug":
                console.debugger(`${tag}${message}`);
                break;
            default:
                console.log(`${tag}${message}`);
                break;
        }

        return this;
    }

    /**
     * Prepare params and return.
     *
     * @param {Array} values
     * @param {Object} params
     * @return {object}
     */
    params(values =  [], params = {}) {
        let prepared = {}, i;

        values.forEach((value) => {
            for (i in value) {
                if (value[i] == null) {
                    continue;
                }

                prepared[i] = value[i];
            }
        });

        return prepared;
    }

    is(attribute) {
        return this.__boolean(this.get(attribute));
    }

    isset(attribute) {
        return this.get(attribute) != null ? 1 : 0;
    }

    /**
     * Set value of attribute for object. Given value is always cloned.
     *
     * @param {string} name Name of attribute. Name can use docs notation. For
     * example this.set("value", 12) or this.set("value.async", 1).
     *
     * @param {mixed} value
     * @param {object} params
     */
    set(name, value, params = {}) {
        let p = this.__private(cn);

        params.silently = params.silently !== undefined ? params.silently : 0;
        params.syncing = params.syncing !== undefined ? params.syncing : 0;

        if (this.is("@syncing") && !(params.syncing)) {
            p.syncingWaiting.push({
                name,
                value : clone(value),
                params : clone(params),
            });

            return this;
        }

        if (typeof name == "object") {
            let params = value ? value : {};

            value = name;

            params.defined = params.defined ? 1 : 0;

            Object.keys(value).forEach((name) => {
                if (params.defined) {
                    if (!p.definitions.dataStructure.hasOwnProperty(name)) {
                        return;
                    }
                }

                this.set(name, value[name], params);
            });

            return this;
        }else if(typeof name == "string") {
            if (p.definitions.dataStructure.hasOwnProperty(name)) {
                let init = p.definitions.dataStructure[name];

                if (value != null) {
                    if (init.type == "boolean") {
                        value = this.__boolean(value);
                    }

                    if (typeof value == "number" && init.type == "string") {
                        value = value.toString();
                    }

                    if (typeof value == "string" && init.type == "number") {
                        value = parseInt(value);

                        if (isNaN(value)) {
                            this.log(`Wrong type '${typeof value}' of value '${name}'. Value should be type "number".`, "notice", 'tiie.object');
                            value = null;
                        }
                    }

                    if (init.type == "array") {
                        if (!Array.isArray(value)) {
                            this.log(`Wrong type '${typeof value}' of value '${name}'. Value should be type "array".`, "notice", 'tiie.object');

                            value = null;
                        }
                    } else {
                        if (init.type && typeof value != init.type) {
                            if (!(init.type == "boolean" && typeof value == "number")) {
                                this.log(`Wrong type '${typeof value}' of value '${name}'. Value should be type '${init.type}'.`, "notice", 'tiie.object');

                                value = null;
                            }
                        }
                    }
                }

                if (init.notNull && value == null && init.hasOwnProperty("default")) {
                    value = init.default;
                }
            }

            if (name[0] == "-") {
                // Skrócona metoda ustawiania wartości, bez emitowania
                // this.set("-name", "Pawel")
                params.silently = 1;
                name = name.substr(1);
            }

            return this.__setValue(p.data, name, value, params);
        }else{
            this.error("Unsuported params");
        }
    }

    /**
     * Ustawienie wartości w obiekcie, wraz z emitowaniem eventów.
     *
     * @param {object} target
     * @param {string} name
     * @param {*} value
     * @param {object} params
     * @return this
     */
    __setValue(target, name, value, params = {}) {
        let p = this.__private(cn);

        if (target[name] === undefined) {
            target[name] = value;

            this.emit(`${name}:init`, {}, params);
            this.emit(`${name}:change`, {
                previous : undefined
            }, params);

        }else{
            if (params.silently) {
                target[name] = value;
            }else{
                if (!same(target[name], value)) {
                    let previous = target[name];

                    target[name] = value;

                    this.emit(`${name}:change`, {
                        previous
                    }, params);
                }
            }
        }

        return this;
    }

    data(params = {}) {
        let p = this.__private(cn);

        // todo clone to reference
        // Zmienic nazwe parametru clone na reference
        params.clone = params.clone === undefined ? 1 : params.clone;
        params.data = params.data === undefined ? 1 : params.data;

        let data = {};

        for (let key in p.data) {
            if (key[0] == "@") {
                continue;
            }

            data[key] = p.data[key];
        }

        if (params.clone) {
            return clone(data, params);
        }else{
            return data;
        }
    }

    state(params = {}) {
        return this.data(params);
    }

    get(name, value = null, params = {}) {
        let p = this.__private(cn),
            pointer = p.data,
            i,
            length,
            t,
            splited
        ;

        // default params
        params.clone = params.clone === undefined ? 1 : params.clone;
        params.data = params.data === undefined ? 1 : params.data;

        if (name[0] == "&") {
            params.clone = 0;

            name = name.substring(1);
        }else if(name[0] == "*") {
            params.data = 0;
            name = name.substring(1);
        }

        // split name
        // splited = name.split(".");

        // while(splited.length > 1){
        //     t = splited.shift();

        //     if (pointer[t] === undefined) {
        //         return value;
        //     }

        //     pointer = pointer[t];
        // }

        if (pointer[name] === undefined) {
            return value;
        }

        if (params.clone) {
            return clone(pointer[name], params);
        }else{
            return pointer[name];
        }
    }

    /**
     * Return private scope for object.
     *
     * this.__private("App") - return private scope for App
     * let p = this.__private("App", {}) - init private scope for App, and return
     * the
     * this.__private("App", "name") - return value of name attribute at App
     * private scope.
     *
     * When private scope is inited like this
     *     this.__private("View", {
     *         domain : "www.test.pl",
     *         name : this.prepareName()
     *     });
     *
     * Inited values can not be generated by other methods wich use private
     * scope. At this case, this should be do like this.
     *     let p = this.__private("View", {
     *         domain : "www.test.pl",
     *         name : this.prepareName()
     *     });
     *
     *     p.name = this.prepareName();
     *
     *
     * @param {string} id
     * @param {string} attr
     * @param {mixed} value
     * @return {mixed}
     */
    __private(...variables) {
        // if (typeof variables[0] != "string") {
        //     throw(`private scope should has defined id`);
        // }

        if (!pscope.has(this)) {
            // Inicjuje prywatną przestrzeń dla obiektu
            pscope.set(this, {});
        }

        // debugger;
        let scope = pscope.get(this);

        if (variables.length == 0) {
            return scope;
        }

        if (scope[variables[0]] == undefined) {
            scope[variables[0]] = {};
        }

        if (variables.length == 2) {
        }

        if (variables.length == 1) {
            return scope[variables[0]];
        } else if (variables.length == 2) {
            if (typeof variables[1] == "string") {
                return scope[variables[0]][variables[1]];
            } else if (typeof variables[1] == "object") {
                return scope[variables[0]] = variables[1];
            }
        } else if (variables.length == 3) {
            if (typeof variables[1] == "string") {
                if (variables[2] == undefined) {
                    return scope[variables[0]][variables[1]];
                } else {
                    scope[variables[0]][variables[1]] = variables[2];

                    return this;
                }
            }
        }

        this.log(`Wrong private call ${variables[0]}`, "warn");
    }

    /**
     * Register event listener of specific event.
     *
     * @param {string} name Na of event. For example button.submit:click.
     * @param {string} callback Function to call.
     * @param {string} group Grouo of owner. It can be any string. We recoment
     * use this.id() of object.
     *
     * @return $this
     */
    on(name, callback, group) {
        let p = this.__private(cn),
            i
        ;

        if (Array.isArray(name)) {
            for (i in name) {
                this.on(name[i], callback, group);
            }

            return this;
        }

        if (p.events[name] === undefined) {
            p.events[name] = [];
        }

        p.events[name].push({
            name,
            callback,
            group
        });

        return this;
    }

    id() {
        let p = this.__private(cn);

        if (p.id === undefined) {
            p.id = uniqueId++;
        }

        return p.id;
    }

    /**
     * Emituje zdarzenie.
     *
     * @param {string} name - Name of event.
     * @param {Object} params - Params which will be send listener.
     * @param {Object} emitparams - Options for emit.
     */
    emit(name, params = {}, emitparams = {}) {
        let p = this.__private(cn),
            call = [],
            event = {},
            i,
            j
        ;

        event.this = this;
        event.name = name;

        emitparams.ommit = emitparams.ommit === undefined ? null : emitparams.ommit;

        name = name.split(":");

        if (name.length == 1) {
            call.push(name[0]);
        }else if(name.length == 2){
            if (name[0] == "") {
                call.push(`:${name[1]}`);
            }else{
                call.push(`${name[0]}:${name[1]}`);
                call.push(`${name[0]}`);
                call.push(`:${name[1]}`);
            }
        }else{
            throw("Unsuported event format");
        }

        // eventy sa wywolywane od tylu
        for (i = call.length -1; i >= 0; i--) {
            if (p.events[call[i]] === undefined) {
                continue;
            }

            for (j in p.events[call[i]]) {
                if (emitparams.ommit != null) {
                    if (p.events[call[i]][j].group == emitparams.ommit) {
                        continue;
                    }
                }

                eventsQueue.add(p.events[call[i]][j].callback, event, params);
            }
        }

        return this;
    }

    /**
     * Delete event listeners.
     *
     * @param {string|number|function} name
     */
    off(name) {
        let p = this.__private(cn);

        switch (typeof name) {
            case "undefined":
                p.events = {};

                return this;
            case "string":
            case "number":
                for (let event in p.events) {
                    let events = [];

                    for (let i in p.events[event]) {
                        if (p.events[event][i].group != name) {
                            events.push(p.events[event][i]);
                        }
                    }

                    p.events[event] = events;
                }

                return this;
            default :
                this.error("Unsuported params");
        }
    }

    component(name, params = {}) {
        return components.get(name, params);
    }

    __component(name, params = {}) {
        return components.get(name, params);
    }

    __components() {
        return components;
    }

    components() {
        return components;
    }

    // this.trigger("selectRow:success", {

    // });

    // this.on("selectRow#app", funcRef)
    // this.on("selectRow.app", funcRef)

    // this.off();
    // this.off(funcRef);

    // this.off(".app");
    // this.off("#app");
    // this.off("selectRow");

    // this.on("saved:success")
    // this.on("saved:faile")

    // widget.on("event", function(){}, id);
    // widget.off(id);
    // widget.off("change.name");
    // widget.off(function(){});
}

TiieObject.components = function(p) {
    components = p
}

function syncingWaiting(p) {
    while(p.syncingWaiting.length) {
        let setter = p.syncingWaiting.shift();

        this.set(setter.name, setter.value, setter.params);

        if (this.is("@syncing")) {
            return;
        }
    }
}

// setInterval(() => {
//     components.dump();
// }, 2000);

if (window.pscope === undefined) {
    window.pscope = new WeakMap();
}

export default TiieObject;
