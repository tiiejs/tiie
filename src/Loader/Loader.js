import View from "Tiie/View";
import TiieObject from 'Tiie/Object';

import templateLayout from "./resources/layout.html";
import style from './resources/style.scss';

const cn = 'Loader';

/**
 * Base view to display loader.
 */
class Loader extends TiieObject {
    constructor(target, params = {}) {
        super();

        const p = this.__private(cn, {
            target,
            view : new View(templateLayout),
            position : null,
        });

        p.view.target(p.target);
    }

    show() {
        let p = this.__private(cn);

        p.view.show();

        p.position = p.target.css('position');
        p.target.css('position', 'relative');

        return this;
    }

    hide() {
        let p = this.__private(cn);

        p.target.css('position', p.position);
        p.view.hide();

        return this;
    }
}

export default Loader;
