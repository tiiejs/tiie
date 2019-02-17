/** @module Tiie */
import TiieObject from "Tiie/Object";

import View from "Tiie/View";

const cn = 'Icons';

/**
 * Main class to manages icons.
 *
 * @class
 */
class Icons extends TiieObject {
    constructor(icons) {
        super();

        let p = this.__private(cn, {
            icons : [{
                id : `close`,
                html : `<i class="fas fa-times"></i>`,
                class : `fas fa-times`,
            }, {
                id : `error`,
                html : `<i class="fas fa-exclamation-triangle"></i>`,
                class : `fas fa-exclamation-triangle`,
            }]
        });
    }

    get(id, params = {}) {
        let p = this.__private(cn),
            icon = p.icons.find(i => i.id == id)
        ;

        if(icon && params.link) {
            return `<i class="tiie-link ${icon.class}"></i>`;
        } else if(icon) {
            return `<i class="${icon.class}"></i>`;
        } else {
            return ``;
        }
    }
}

export default Icons;
