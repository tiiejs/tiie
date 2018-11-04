import TopiObject from 'Topi/Object';
import View from "Topi/View";

import templateContent from "Topi/Dialog/Views/Alert.content.html";
import templateLayout from "Topi/Dialog/Views/Alert.layout.html";

const cn = 'Alert';

/**
 * Base view to display alert.
 *
 * @param {Object} params
 *     - type
 *     - title
 *     - content
 *     - buttons
 */
class Alert extends View {
    constructor(params = {}) {
        super(templateLayout);

        const p = this.__private(cn, {});

        this.set('-type', params.type === undefined ? 'default' : params.type);
        this.set('-title', params.title === undefined ? null : params.title);
        this.set('-content', params.content === undefined ? null : params.content);
        this.set('-buttons', params.buttons === undefined ? [] : params.buttons);

        this.on([
            'type',
            'title',
            'content',
            'buttons',
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

        this.element('content').html(this.template(templateContent)(this.data()));

        return this;
    }
}

export default Alert;
