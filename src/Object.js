import same from 'Topi/Utils/same';
import clone from 'Topi/Utils/clone';

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

/**
 * TopiObject
 */
const cn = 'TopiObject';
class TopiObject {

    constructor(data = {}) {
        let p = this.private(cn, {
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

    warn(message) {
        console.warn(message);

        return this;
    }

    error(error) {
        let p = this.private(cn),
            router = this.component('@router')
        ;

        router.forward('@error', {error});

        return this;
    }

    log(message, type = 'log') {
        switch (type) {
            case 'error':
                return this.error(message);
            default:
                console.warn(type, message);
        }

        return this;
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
        let p = this.private(cn);

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
        let p = this.private(cn);

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
        let p = this.private(cn);

        // todo clone to reference
        // Zmienic nazwe parametru clone na reference
        params.clone = params.clone === undefined ? 1 : params.clone;
        params.data = params.data === undefined ? 1 : params.data;

        if (params.clone) {
            return clone(p.data, params);
        }else{
            return p.data;
        }
    }

    get(name, value = null, params = {}) {
        let p = this.private(cn),
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
     * this.private("App") - return private scope for App
     * let p = this.private("App", {}) - init private scope for App, and return
     * the
     * this.private("App", "name") - return value of name attribute at App
     * private scope.
     *
     * When private scope is inited like this
     *     this.private("View", {
     *         domain : "www.test.pl",
     *         name : this.prepareName()
     *     });
     *
     * Inited values can not be generated by other methods wich use private
     * scope. At this case, this should be do like this.
     *     let p this.private("View", {
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
    private(id, attr, value){
        if (!pscope.has(this)) {
            // Inicjuje prywatną przestrzeń dla obiektu
            pscope.set(this, {});
        }

        if (pscope.get(this)[id] === undefined) {
            // Nie ma prywatnej przestrzeni dla ID

            if (attr === undefined) {
                pscope.get(this)[id] = {};
            }else{
                // Sytuacja w której podane są wartości do zainicjowania
                pscope.get(this)[id] = attr;
            }

            return pscope.get(this)[id];
        }

        if (attr === undefined) {
            // Zwraca całą prywatną przestrzeń
            return pscope.get(this)[id];
        }else{
            if (typeof attr == 'string') {
                if (value === undefined) {
                    // Zwracam wartość podanego argumentu
                    return pscope.get(this)[id][attr];
                }else{
                    // Ustawiam nową wartość
                    pscope.get(this)[id][attr] = value;

                    return this;
                }
            }

            this.log("Wrong private call", "warn");
        }

        this.log("Wrong private call", "warn");
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
        let p = this.private(cn),
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
        let p = this.private(cn);

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
        let p = this.private(cn),
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
        let p = this.private(cn);

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

if (window.pscope === undefined) {
    window.pscope = new WeakMap();
}

export default TopiObject;
