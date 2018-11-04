import same from 'Topi/Utils/same';
import clone from 'Topi/Utils/clone';
import boolean from 'Topi/Utils/boolean';

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

const cn = 'TopiObject';

/**
 * TopiObject
 */
class TopiObject {

    constructor(data = {}) {
        let p = this.__private(cn, {
            // Eventy
            events : {},

            // Dane obiektu
            data,
        });
    }

    /**
     * Tworzy klon obiektu.
     */
    clone() {

    }

    boolean(value) {
        if (value == '0') {
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
            router = this.component('@router')
        ;

        router.forward('@error', {error});

        return this;
    }

    log(message, type = 'log', tag = null) {
        if (tag != null) {
            tag = `[${tag}] `;
        } else {
            tag = '';
        }

        switch (type) {
            case 'error':
                return this.error(`${tag}${message}`);
            case 'warn':
                console.warn(`${tag}${message}`);
                break;
            case 'log':
                console.log(`${tag}${message}`);
                break;
            case 'debug':
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
        let prepared = {};

        values.forEach((value) => {
            // value = clone(value);

            for (let i in value) {
                if (value[i] == null) {
                    continue;
                }

                prepared[i] = value[i];
            }
        });

        return prepared;
    }

    /**
     * Set value of attribute for object. Given value is always cloned.
     *
     * @param {string} name Name of attribute. Name can use docs notation. For
     * example this.set("value", 12) or this.set("value.async", 1).
     *
     * @param {mixed} value
     * @param {object} emitparams
     */
    set(name, value, emitparams = {}) {
        let p = this.__private(cn);

        value = clone(value);

        // Czy wartość ma być ustawiona, bez emitowania zdarzeń.
        emitparams.silently = emitparams.silently === undefined ? 0 : 1;

        if (name[0] == '-') {
            // Skrócona metoda ustawiania wartości, bez emitowania
            // this.set('-name', "Pawel")
            emitparams.silently = 1;
            name = name.substr(1);
        }

        if (typeof name == 'object') {
            // todo Ustawianie wielu wartości za pomoca jednego obiektu.
        }else if(typeof name == 'string') {
            return this.__setValue(p.data, name, value, emitparams);
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
     * @param {object} emitparams
     * @return this
     */
    __setValue(target, name, value, emitparams = {}) {
        let p = this.__private(cn);

        if (target[name] === undefined) {
            target[name] = value;

            this.emit(`${name}:init`, {}, emitparams);
            this.emit(`${name}:change`, {
                previous : undefined
            }, emitparams);

        }else{
            if (emitparams.silently) {
                target[name] = value;
            }else{
                if (!same(target[name], value)) {
                    let previous = target[name];

                    target[name] = value;

                    this.emit(`${name}:change`, {
                        previous
                    }, emitparams);
                }
            }
        }

        return this;
    }

    /**
     * Zwraca informację czy obiekt spełnia podane kryteriu
     *
     * @param {string} name
     * @return {integer} 0 lub 1
     */
    is(name) {
        return 0;
    }

    data(params = {}) {
        let p = this.__private(cn);

        // todo clone to reference
        // Zmienic nazwe parametru clone na reference
        params.clone = params.clone === undefined ? 1 : params.clone;
        params.data = params.data === undefined ? 1 : params.data;

        let data = {};

        for (let key in p.data) {
            if (key[0] == '@') {
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

        if (name[0] == '&') {
            params.clone = 0;

            name = name.substring(1);
        }else if(name[0] == '*') {
            params.data = 0;
            name = name.substring(1);
        }

        // split name
        // splited = name.split('.');

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
        // if (typeof variables[0] != 'string') {
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
            // console.log('variables', variables);
            // console.log('scope', scope);
        }

        if (variables.length == 1) {
            return scope[variables[0]];
        } else if (variables.length == 2) {
            if (typeof variables[1] == 'string') {
                return scope[variables[0]][variables[1]];
            } else if (typeof variables[1] == 'object') {
                return scope[variables[0]] = variables[1];
            }
        } else if (variables.length == 3) {
            if (typeof variables[1] == 'string') {
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

        name = name.split(':');

        if (name.length == 1) {
            call.push(name[0]);
        }else if(name.length == 2){
            if (name[0] == '') {
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
            case 'undefined':
                p.events = {};

                return this;
            case 'string':
            case 'number':
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

    components() {
        return components;
    }

    // this.trigger('selectRow:success', {

    // });

    // this.on('selectRow#app', funcRef)
    // this.on('selectRow.app', funcRef)

    // this.off();
    // this.off(funcRef);

    // this.off('.app');
    // this.off('#app');
    // this.off('selectRow');

    // this.on('saved:success')
    // this.on('saved:faile')

    // widget.on('event', function(){}, id);

    // widget.off(id);
    // widget.off('change.name');
    // widget.off(function(){});

    // Events
}

TopiObject.components = function(p) {
    components = p
}


setInterval(() => {
    components.dump();
}, 2000);

if (window.pscope === undefined) {
    window.pscope = new WeakMap();
}

export default TopiObject;
