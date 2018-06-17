import TopiObject from 'Topi/Object';
import View from 'Topi/View';
import ViewDialog from 'Topi/Dialog/Views/Dialog'

const cn = 'Dialog';
class Dialog extends TopiObject {
    dialog(params = {}) {
        const app = this.component('@app'),
            view = new ViewDialog(params)
        ;

        view.render();

        app.target().append(view.element());

        return view;
    }
}

export default Dialog;
