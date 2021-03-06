import Action from 'Tiie/Action';
import View from 'Tiie/View';

import WCheckboxList from 'Tiie/Widgets/CheckboxList/CheckboxList';

const cn = 'CheckboxListState';
class CheckboxListState extends Action {
    async run(params, controller) {
        const p = this.__private(cn),
            view = {}
        ;

        return super.run(params, controller).then(() => {
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
        });
    }
}

export default CheckboxListState;
