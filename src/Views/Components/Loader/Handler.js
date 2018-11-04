import TopiObject from 'Topi/Object';

const cn = 'Handler';

/**
 * Handler to control loader view.
 */
class Handler extends TopiObject {
    constructor(view, manager, params = {}) {
        super();

        const p = this.__private(cn);

        p.view = view;
        p.manager = manager;
        // p.params = view;
    }

    remove() {
        const p = this.__private(cn);

        p.view.remove();
    }
}

export default Handler;
