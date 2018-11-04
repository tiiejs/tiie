import TopiObject from 'Topi/Object';
import View from "Topi/View";

import templateDialog from "Topi/Dialog/Views/Dialog.dialog.html";
import templateLayout from "Topi/Dialog/Views/Dialog.layout.html";

const cn = 'Dialog';

/**
 * Base view to display simple dialog.
 *
 * @param {Object} params
 *     - title
 *     - content
 *     - buttons
 */
class Dialog extends View {

    constructor(params = {}) {
        super(templateLayout);

        const p = this.__private(cn, {});

        this.set('-title', params.title === undefined ? null : params.title);
        this.set('-content', params.content === undefined ? null : params.content);
        this.set('-buttons', params.buttons === undefined ? [] : params.buttons);

        this.on([
            'title',
            'content',
            'title',
        ], () => {
            this.reload();
        }, this.id());

        this.element().on("click", (event) => {
            const button = this.get("buttons").find(button => button.id == "close");

            if (this.$(event.target).hasClass("topi-dialog")) {
                this.emit("button.close:click", {
                    target : button == undefined ? null : button,
                    event
                });
            }
        });

        this.on("button.close:click", (event, params) => {
            this.remove();
        });

        this.element().on("click", "button", (event) => {
            let target = this.$(event.currentTarget),
                id = target.data("id"),
                button = this.get("buttons").find(button => button.id == id)
            ;

            if (button === undefined) {
                this.log(`Button ${id} is not defined at for`, "warn");
            }else{
                this.emit(`button.${id}:click`, {
                    target : button,
                    event,
                });
            }

            event.stopPropagation();
            event.preventDefault();
        });
    }

    render() {
        const p = this.__private(cn);

        this.element().html(this.template(templateDialog)(this.data()));

        return this;
    }
}

export default Dialog;
