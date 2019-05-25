/** @module Tiie */
import TiieObject from 'Tiie/Object';

const cn = 'Components';

/**
 * Mechanism of components.
 *
 * The components' Mechanism allows you to manage services within the application
 * area in a fairly simple way.
 *
 * Using components, we can also implement dependency injection.
 *
 * @param {object} components
 *
 * @class
 */
class Components extends TiieObject {
    constructor(components = {}) {
        super();

        let p = this.__private(cn, {
            components,
            inited : {},
            register : {},
        });
    }

    get(name, params = {}) {
        let p = this.__private(cn);

        if (name[0] == '@') {
            if (p.inited[name] === undefined) {
                if (p.components[name] === undefined) {
                    this.__error(`Component ${name} is not defined.`);
                }

                p.inited[name] = p.components[name](this, params);
            }

            return p.inited[name];
        } else if (name[0] == '#') {
            if (p.inited[name] === undefined) {
                this.__log(`Component ${name} does not exists.`, 'warn', 'tiie.components');

                return null;
            }

            return p.inited[name];
        } else {
            if (p.components[name] === undefined) {
                this.__error(`Component ${name} is not defined.`);
            }

            return p.components[name](this, params);
        }
    }

    list() {
        let p = this.__private(cn);

        console.log('Inited');
        console.log('------------------------');
        for (let key in p.inited) {
            let color = 'color : black;';

            if (key[0] == '#') {
                color = 'color : blue;';
            }

            if (p.inited[key].data != undefined) {
                console.log(`%c${key} -> %O, state %O`, color, p.inited[key], p.inited[key].data());
            } else {
                console.log(`%c${key} -> %O`, color, p.inited[key], p.inited[key].data());
            }
        }

        console.log('Components');
        console.log('------------------------');
        for (let key in p.components) {
            if (!p.inited.hasOwnProperty(key)) {
                console.log(key);
            }
        }
    }

    set(name, service) {
        let p = this.__private(cn);

        p.inited[name] = service;

        return this;
    }

    /**
     * Check if component with name exists.
     *
     * @since 1.0.0
     * @param {string} name
     * @return {int}
     */
    exists(name) {
        let p = this.__private(cn);

        return p.inited[name] || p.component[name] ? 1 : 0;
    }

    dump() {
        let p = this.__private(cn);

        if (window.dump == undefined) {
            window.dump = {};
        };

        for (let key in p.inited) {
            if (key[0] == '#') {
                window[`dump_register_${key.substring(1).replace(/\./g, '_')}`] = p.inited[key];
            } else if(key[0] == '@') {
                window[`dump_service_${key.substring(1).replace(/\./g, '_')}`] = p.inited[key];
            }
        }
    }
}

export default Components;
