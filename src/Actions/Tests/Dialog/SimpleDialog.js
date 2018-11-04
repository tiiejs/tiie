import Action from 'Topi/Action';
import View from 'Topi/View';
import templateLayout from 'Topi/Actions/Tests/Dialog/SimpleDialog.layout.html'

const cn = 'Dialog';
class Dialog extends Action {
    async run(params, controller) {
        let p = this.__private(cn),
            router = this.component('@router'),
            dialog = this.component('@dialog'),
            view = {}
        ;

        return super.run(params, controller).then(() => {
            view.layout = new View(templateLayout);

            view.layout.target(controller.element())
                .render()
            ;

        }).then(() => {
            view.dialog = dialog.dialog({
                title : "You add new offer",
                content : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consequat vestibulum lorem, eu malesuada orci posuere vitae. Nunc bibendum libero ipsum, et semper tortor sodales eu. Proin feugiat eleifend ante. Nulla felis diam, convallis nec facilisis id, interdum porttitor libero. Vestibulum ut augue velit. Integer mollis laoreet eleifend. Proin tempor lacus nec velit condimentum, in maximus velit maximus. Aliquam nec ligula nec nunc facilisis tincidunt. Praesent non nunc ac erat ornare sagittis. Praesent maximus tellus in erat congue, a bibendum metus ultrices. Vivamus non porta est. In hendrerit dictum est, non vulputate ipsum viverra in. Aliquam nulla libero, dictum a ultricies ornare, mattis nec augue. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed ultrices ultrices turpis, non cursus dui gravida fermentum.  Nullam malesuada ex id orci pretium, ac placerat ex pulvinar. Phasellus finibus nibh eu augue porta, quis euismod sapien tempus. Mauris viverra vehicula justo, nec sollicitudin dolor imperdiet mollis. Morbi quam mauris, interdum at commodo at, sodales quis tortor. Mauris euismod augue ut nunc sagittis, at mattis ligula rutrum. Phasellus tempor euismod arcu, nec pretium magna convallis sed. Mauris nisl lorem, laoreet sit amet risus vitae, posuere ultrices libero. Nunc eget arcu massa. Proin neque tortor, egestas vitae tincidunt sit amet, euismod eget metus. Ut est leo, auctor vitae neque id, lobortis placerat sapien. Aenean sagittis, ligula id fringilla convallis, leo lacus feugiat tellus, vitae finibus augue felis ac leo.  Suspendisse arcu ligula, volutpat a velit suscipit, porttitor luctus urna. Nulla cursus sollicitudin ex, et elementum ipsum laoreet vel. Mauris lobortis fermentum enim. Duis sed nunc dapibus lorem varius fermentum at eget augue. Ut efficitur odio et est sodales lacinia sed at leo. Sed in purus in augue pretium egestas. Aenean vel nisl nec turpis euismod accumsan at vel orci. Sed in massa vitae enim venenatis tempor blandit ac nulla. Aliquam a arcu tempus, condimentum magna quis, sollicitudin turpis. Suspendisse potenti. Maecenas venenatis nec lectus a imperdiet. Phasellus aliquet, turpis id interdum facilisis, nisi odio porttitor libero, vel commodo justo ex a odio.",
                buttons : [{
                    id : 'close',
                    label : "Zamknij",
                    ico : "kros",
                    section : "header",
                }, {
                    id : 'ok',
                    label : "OK",
                    type : 'primary',
                    // ico : "kros",
                    section : "footer.right",
                }],
            });


            view.dialog.on("button.ok:click", (event, params) => {

                console.log('button.ok.click');
            });

            // view.form = new WForm();
            // view.form.target(controller.element());
            // view.form.render();
        });
    }
}

export default Dialog;
