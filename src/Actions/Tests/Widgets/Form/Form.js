import Action from 'Tiie/Action';
import View from 'Tiie/View';
import WForm from 'Tiie/Form/Form';

const cn = 'Form';
class Form extends Action {
    async run(params, controller) {
        let p = this.__private(cn),
            view = {}
        ;

        return super.run(params, controller).then(() => {
            view.layout = new View(`<div name="form" class="cell small-12 medium-12 large-12"></div>`);

            view.layout.target(controller.element())
                .render()
            ;

        }).then(() => {
            view.form = new WForm();
            view.form.target(controller.element());
            view.form.render();
        });
    }
}

export default Form;
