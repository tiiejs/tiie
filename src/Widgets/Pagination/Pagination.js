import Widget from "Tiie/Widgets/Widget";

import templateLayout from './resources/layout.html';
import style from './resources/style.scss';

const cn = "Pagination";
class Pagination extends Widget {
    constructor(state = {}) {
        super(templateLayout);

        let p = this.__private(cn, {
            previousValue : null,
        });

        this.set("-pages", state.pages === undefined ? 0 : state.pages);
        this.set("-value", state.value === undefined ? 0 : state.value);

        this.on([
            "pages",
            "value",
        ], () => {
            this.reload();
        }, this.id());

        this.element("next").click((event) => {
            let value = parseInt(this.get("value")),
                pages = parseInt(this.get("value"))
            ;

            value++;

            if (value == pages) {
                event.stopPropagation();
                event.preventDefault();

                return;
            }

            this.set("value", value);

            event.stopPropagation();
            event.preventDefault();
        });

        this.element("previous").click((event) => {
            let value = parseInt(this.get("value"));

            value--;

            if (value == -1) {
                event.stopPropagation();
                event.preventDefault();

                return;
            }

            this.set("value", value);

            event.stopPropagation();
            event.preventDefault();
        });

        this.element("page").on("focusin", (event) => {
            p.previousValue = this.$(event.target).val();
        });

        this.element("page").on("focusout", (event) => {
            const target = this.$(event.target);
            let valueInt = parseInt(target.val());

            if (Number.isInteger(valueInt)) {
                valueInt--;

                if (this._checkValue(valueInt)) {
                    this.set("value", valueInt);
                }else{
                    target.val(p.previousValue);
                }
            }else{
                target.val(p.previousValue);
            }

        });

        this.element("page").click((event) => {
            event.stopPropagation();
            event.preventDefault();
        });
    }

    _checkValue(value) {
        const p = this.__private(cn),
            pages = this.get("pages"),
            valueInt = parseInt(value)
        ;

        if (Number.isInteger(valueInt)) {
            if (value == 0) {
                return 1;
            }else{
                if (valueInt >= 0 && value < pages) {
                    return 1;
                }else{
                    return 0;
                }
            }
        }else{
            return 0;
        }
    }

    __setValue(target, name, value, emitparams = {}) {
        const p = this.__private(cn);

        if (name == "pages") {
            const valueInt = parseInt(value);

            if (Number.isInteger(valueInt)) {
                return super.__setValue(target, name, valueInt, emitparams);
            }
        } else if (name == "value") {
            if (this._checkValue(value)) {
                const valueInt = parseInt(value);

                return super.__setValue(target, name, valueInt, emitparams);
            }
        }else{
            return super.__setValue(target, name, value, emitparams);
        }
    }

    render() {
        super.render();

        let p = this.__private(cn),
            pages = parseInt(this.get("pages")),
            value = parseInt(this.get("value"))
        ;

        if (value == 0) {
            // this.element("previous").hide();
            this.element("previous").addClass('--disabled');
        }else{
            // this.element("previous").show();
            this.element("previous").removeClass('--disabled');
        }

        this.element("page").html(value + 1);
        this.element("from").html(pages);

        if (value == pages - 1) {
            // this.element("next").hide();
            this.element("next").addClass('--disabled');
        }else{
            // this.element("next").show();
            this.element("next").removeClass('--disabled');
        }

        return this;
    }
}

export default Pagination;
