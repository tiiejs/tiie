import Widget from "Topi/Views/Widgets/Widget";

const cn = "Input";
class Input extends Widget {
    constructor(params = {}) {
        super(`<input type="text" class="topi-input">`, params);

        const p = this.private(cn);

        this.set("-value", params.value === undefined ? null : params.value);
        this.set("-placeholder", params.placeholder === undefined ? null : params.placeholder);
        this.set("-type", params.type === undefined ? null : params.type);
        this.set("-state", params.state === undefined ? {type : "default"} : params.state);

        this.on([
            "value",
            "placeholder",
            "type",
        ], () => {
            this.reload();
        }, this.id());

        this.on([
            "state",
        ], () => {
            this._reloadState();
        }, this.id());

        this.element().on("focusin", () => {
            let state = this.get("&state");

            if (state.type == "error") {
                this.element().removeClass("--error");
            }

            this.element().val(this.get("value"));
        });

        this.element().on("focusout", () => {
            let input = this.element().get(0);
            let value;

            let state = this.get("&state");

            if (state.type == "error") {
                this.element().addClass("--error");
            }

            if (input.inputmask) {
                value = input.inputmask.unmaskedvalue();
            }else{
                value = this.element().val();
            }

            if (value === undefined) {
                this.log("Value of input can not be get.", "warn");
                value = null;
            }

            this.set("value", value === "" ? null : value);
        });
    }

    /**
     * Render Input
     */
    render() {
        super.render();

        const p = this.private(cn),
            value = this.get("&value"),
            placeholder = this.get("&placeholder")
        ;

        if (placeholder != null) {
            this.element().attr("placeholder", placeholder);
        }else{
            this.element().removeAttr("placeholder");
        }

        this._mask();

        if (value == null) {
            this.element().val("");
        }else{
            this.element().val(value);
        }

        this._reloadState();

        return this;
    }

    /**
     * Set mask to input. Mask is dependent from type of input.
     */
    _mask() {
        const p = this.private(),
            type = this.get("type")
        ;

        if (type == null) {
            return;
        }

        switch (type) {
            case "price":
                // (new Inputmask({
                //     alias: "numeric",
                //     suffix: " zł",
                //     groupSeparator: " ",
                //     placeholder: "",
                //     autoGroup: true,
                //     digits: 2,
                //     clearMaskOnLostFocus: 1
                // })).mask(this.element().get(0));

                this.element().mask('999999999999999,99');

                break;
            case "year":
                // (new Inputmask({
                //     alias: "numeric",
                //     placeholder: "",
                //     autoGroup: true,
                //     max : 2100,
                //     min : 0,
                //     integerDigits : 4,
                //     clearMaskOnLostFocus: 1
                // })).mask(this.element().get(0));

                break;
            case "integer":
                // (new Inputmask({
                //     alias: "numeric",
                //     placeholder: " ",
                //     autoGroup: true,
                //     clearMaskOnLostFocus: 1
                // })).mask(this.element().get(0));

                break;
            case "email":
                // this.element().mask("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", {
                //     translation : {
                //         "a" : {
                //             pattern: /[A-Za-z0-9]|./,
                //             optional: true
                //         }
                //     }

                // });

                // (new Inputmask({
                //     alias: "email",
                //     clearMaskOnLostFocus: 1
                // })).mask(this.element().get(0));

                break;
            default :
                this.log(`Unsuported type of Input ${type}.`, "warn");
        }
    }

    _reloadState() {
        let p = this.private(cn),
            state = this.get("&state")
        ;

        this.element().removeClass("--error");

        switch (state.type) {
            case "error":
                this.element().addClass("--error");
        }
    }
}

export default Input;
