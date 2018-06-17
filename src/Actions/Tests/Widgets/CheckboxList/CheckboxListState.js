import Action from 'Topi/Action';
import View from 'Topi/View';
import WCheckboxList from 'Topi/Views/Widgets/CheckboxList';

const cn = 'CheckboxListState';
class CheckboxListState extends Action {
    async run(params, controller) {
        const p = this.private(cn),
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
