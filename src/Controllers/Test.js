import Controller from 'Topi/Controller';
import View from 'Topi/View';

import templateLayout from 'Topi/Controllers/Test.layout.html';

const cn = 'Test';
class Test extends Controller {
    constructor(target) {
        super(target);

        const p = this.__private(cn, {
            target,
            action : null,
            view : {
                layout : new View(templateLayout),
            },
        });
    }

    /**
     * Zwraca referencję do określonego kontenera dla kontroller.
     *
     * @param {string} name Jeśli wartość nie zostanie podana, to zwracany jest
     * podstawowy kontener.
     * @return {jQuery}
     */
    element(name) {
        const p = this.__private(cn);

        return p.view.layout.element('container');
    }

    async action(action, params = {}) {
        const p = this.__private(cn);

        return new Promise((resolve, reject) => {
            if (p.action != null) {
                p.action.end().then(() => {
                    // clean container
                    p.view.layout.element('container').html('');

                    // run new action
                    p.action = new action();
                    p.action.run(params, this).then(() => {
                        resolve();
                    });
                });
            }else{
                // clean container
                p.view.layout.element('container').html('');

                // run new action
                p.action = new action();
                p.action.run(params, this).then(() => {
                    resolve();
                });
            }
        });
    }

    async run() {
        const p = this.__private(cn);

        return new Promise((resolve, reject) => {
            p.view.layout
                .target(p.target)
                .render()
            ;

            resolve();
        });
    }

    async end() {
        return Promise.resolve();
    }
}

export default Test;
