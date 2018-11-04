import ActionTemplate from 'Topi/Modules/Actions/Template';
import View from 'Topi/View';
import Action from 'Topi/Action';
import template from 'Topi/Actions/Index.html';

const cn = 'Index';
class Index extends Action {
    async run(params, controller) {
        return super.run(params, controller).then(() => {
            let p = this.__private(cn),
                router = this.component('@router'),
                view = {}
            ;

            view.cards = new View(template);
            view.cards.target(controller.element())
                .render()
            ;

            view.cards.element('automotive').click((event) => {
                router.event('/offers', event, {categoryId : 41});

                event.stopPropagation();
                event.preventDefault();
            });

            view.cards.element('estates').click((event) => {
                router.event('/offers', event, {categoryId : 40});

                event.stopPropagation();
                event.preventDefault();
            });

            view.cards.element('work').click((event) => {
                router.event('/offers', event, {categoryId : 52});

                event.stopPropagation();
                event.preventDefault();
            });
        });
    }
}

export default Index;
