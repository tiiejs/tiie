import Action from 'Tiie/Action';
import View from 'Tiie/View';
import WSelectRemote from 'Tiie/Widgets/SelectRemote/SelectRemote';

const cn = 'New';
class New extends Action {
    async run(params, controller) {
        return super.run(params, controller).then(() => {
            let p = this.__private(cn),
                api = this.component("@api"),
                router = this.component('@router'),
                view = {}
            ;

            view.layout = new View(`
                <div>
                    <div name="select"></div>
                </div>
            `);

            view.layout.target(controller.element());
            view.layout.render();

            view.select = new WSelectRemote({
                endpoint : api.endpoint("/api/offers/locations"),
                value : [24, 25, 26],
                // multiple : 1
            });

            view.select.target(view.layout.element('select'));
            view.select.render();

            view.select.on('value:change', (event) => {
            });

        }).catch((error) => {
            this.error(error);
        })
    }
}

export default New;
