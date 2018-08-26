import TopiObject from 'Topi/Object';
import View from "Topi/View";

import templateContent from "Topi/Dialog/Views/Modal.content.html";
import templateLayout from "Topi/Dialog/Views/Modal.layout.html";

const cn = 'Modal';

/**
 * Base View to display modal.
 *
 * @param {Topi.View} view View to display at modal.
 */
class Modal extends View {
    constructor(view, params = {}) {
        super(templateLayout);

        const p = this.private(cn, {});

        p.view = view;
    }

    render() {
        const p = this.private(cn);

        return p.view
            .target(this.element('content'))
            .render()
        ;
    }
}

export default Modal;
