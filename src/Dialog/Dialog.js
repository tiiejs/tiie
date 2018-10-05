import TopiObject from 'Topi/Object';

import ViewDialog from 'Topi/Dialog/Views/Dialog';
import ViewAlert from 'Topi/Dialog/Views/Alert';
import ViewModal from 'Topi/Dialog/Views/Modal';

const cn = 'Dialog';

class Dialog extends TopiObject {
    dialog(params = {}) {
        let app = this.component('@app'),
            view = new ViewDialog(params)
        ;

        view.render();

        app.target().append(view.element());

        return view;
    }

    /**
     * Display alert.
     */
    alert(params = {}) {
        let app = this.component('@app'),
            view = new ViewAlert(params)
        ;

        view.render();

        app.target().append(view.element());

        return view;
    }

    /**
     * Modal
     */
    modal(view, params = {}) {
        let app = this.component('@app'),
            modal = new ViewModal(view, params)
        ;

        modal.target(app.target());

        app.target().append(modal.element());

        modal.render();

        return modal;
    }
}

export default Dialog;
