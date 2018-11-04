import Action from 'Topi/Action';
import View from 'Topi/View';
import WForm from 'Topi/Views/Widgets/Form';

const cn = 'Form';
class Form extends Action {
    async run(params, controller) {
        let p = this.__private(cn),
            router = this.component('@router'),
            dialog = this.component('@dialog'),
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
