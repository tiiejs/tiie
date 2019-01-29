import TiieObject from 'Tiie/Object';
import View from "Tiie/View";

import templateContent from "./Modal.content.html";
import templateLayout from "./Modal.layout.html";

const cn = 'Modal';

/**
 * Base View to display modal.
 *
 * @param {Tiie.View} view View to display at modal.
 */
class Modal extends View {
    constructor(view, params = {}) {
        super(templateLayout);

        const p = this.__private(cn, {
            view,
        });

        // tiny
        // small
        // normal
        // large
        // fullscreen
        this.set('-size', params.size == undefined ? 'normal' : params.size);

        this.element().on('click', (event) => {
            this.remove();

            event.stopPropagation();
            event.preventDefault();
        });

        this.element('content').on('click', (event) => {
            event.stopPropagation();
            event.preventDefault();
        });

        this.on(':change', (event) => {
            this.reload();
        });
    }

    render() {
        const p = this.__private(cn);

        this.element('content').attr('class', `tiie-dialog-modal --${this.get('size')}`);

        p.view
            .target(this.element('content'))
            .render()
        ;

        return this;
    }
}

export default Modal;
