import TiieObject from 'Tiie/Object';
import View from "Tiie/View";

const cn = 'Controller';

/**
 * The basic implementation of the controller.
 */
class Controller extends TiieObject {
    constructor(components) {
        super();

        let p = this.__private(cn, {
            components,
        });
    }

    __component(name) {
        let p = this.__private(cn);

        return p.components.get(name);
    }

    __components() {
        let p = this.__private(cn);

        return p.components;
    }

    view(input) {
        let p = this.__private(cn);

        if (typeof input == 'string') {
            p.view = new View(input)

            return this;
        } else {
            return p.view ? p.view : null;
        }
    }

    content() {
        return this.view().element('content');
    }

    async run(params = {}) {
        return Promise.resolve();
    }

    async reload(params) {
        return Promise.resolve();
    }

    async sleep() {
        return new Promise((resolve, reject) => {
            this.view().hide();

            resolve();
        });
    }

    async wakeup() {
        return new Promise((resolve, reject) => {
            this.view().show();

            resolve();
        });
    }

    async end() {
        return Promise.resolve();
    }
}

export default Controller;
