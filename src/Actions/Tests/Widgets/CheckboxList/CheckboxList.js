import Action from 'Topi/Action';
import View from 'Topi/View';
import WCheckboxList from 'Topi/Views/Widgets/CheckboxList';

const cn = 'CheckboxList';
class CheckboxList extends Action {
    async run(params, controller) {
        let p = this.__private(cn),
            router = this.component('@router'),
            dialog = this.component('@dialog'),
            view = {}
        ;

        return super.run(params, controller).then(() => {
            view.layout = new View(`<div></div>`);

            view.layout.target(controller.element())
                .render()
            ;
        }).then(() => {
            view.object = new WCheckboxList({
                multiple : 1,
                value : 2,
                items : [{
                    id : 1,
                    name : "Warszawa",
                }, {
                    id : 2,
                    name : "Gdańsk",
                }, {
                    id : 3,
                    name : "Radom",
                }, {
                    id : 4,
                    name : "Nowa Słupia",
                }]
            });

            view.object.target(controller.element());
            view.object.render();

            view.object.on("value", (event, params) => {

            });
        });
    }
}

export default CheckboxList;
