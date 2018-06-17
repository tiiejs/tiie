import Action from 'Topi/Action';
import View from 'Topi/View';
import template from 'Topi/Actions/NotFound.html';

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
