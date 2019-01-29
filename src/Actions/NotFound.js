import Action from 'Tiie/Action';
import View from 'Tiie/View';
import template from 'Tiie/Actions/NotFound.html';

class NotFound extends Action {
    async run(params, controller) {
        return super.run(params, controller).then(() => {
            let layout = new View(template);

            layout
                .target(controller.element())
                .render()
            ;

            // this.register(layout);
        });
    }
}

export default NotFound;
