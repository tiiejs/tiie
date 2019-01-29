import Widget from "Tiie/Widgets/Widget";

const cn = "Input";
class Input extends Widget {
    constructor(state = {}, params = {}) {
        super(`<input type="text" class="tiie-input">`, state);

        const p = this.__private(cn);

        this.set("-value", state.value === undefined ? null : state.value);
        this.set("-placeholder", state.placeholder === undefined ? null : state.placeholder);
        this.set("-type", state.type === undefined ? null : state.type);
        this.set("-state", state.state === undefined ? {type : "default"} : state.state);

        params.mode = params.mode == undefined ? Input.MODE_FOCUS : params.mode;

        // Check mode
        if (![Input.MODE_ACTIVE, Input.MODE_FOCUS].includes(params.mode)) {
            this.log(`Unknown type of mode for input ${params.mode}.`, "warn", "tiie.view.widgets.input");

            params.mode = Input.MODE_FOCUS;
        }

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

        if (params.mode == Input.MODE_FOCUS) {
            this.element().on("focusin", (event) => {
                let state = this.get("&state");

                if (state.type == "error") {
                    this.element().removeClass("--error");
                }

                this.element().val(this.get("value"));

                event.stopPropagation();
                event.preventDefault();
            });

            this.element().on("focusout", (event) => {
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

                event.stopPropagation();
                event.preventDefault();
            });
        } else if(params.mode == Input.MODE_ACTIVE) {
            this.element().on("focusin", (event) => {
                let state = this.get("&state");

                if (state.type == "error") {
                    this.element().removeClass("--error");
                }

                event.stopPropagation();
                event.preventDefault();
            });

            this.element().on("keyup", (event) => {
                let state = this.get("&state");

                if (state.type == "error") {
                    this.element().addClass("--error");
                } else {
                    this.element().removeClass("--error");
                }

                let value = this.element().val() == '' ? null : this.element().val();

                this.set('value', value, {ommit : this.id()});

                event.stopPropagation();
                event.preventDefault();
            });

            // this.element().on("focusout", (event) => {
            //     let input = this.element().get(0);
            //     let value;

            //     let state = this.get("&state");

            //     if (state.type == "error") {
            //         this.element().addClass("--error");
            //     }

            //     if (input.inputmask) {
            //         value = input.inputmask.unmaskedvalue();
            //     }else{
            //         value = this.element().val();
            //     }

            //     if (value === undefined) {
            //         this.log("Value of input can not be get.", "warn");
            //         value = null;
            //     }

            //     this.set("value", value === "" ? null : value);

            //     event.stopPropagation();
            //     event.preventDefault();
            // });
        }
    }

    /**
     * Render Input
     */
    render() {
        super.render();

        const p = this.__private(cn),
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
        const p = this.__private(),
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
        let p = this.__private(cn),
            state = this.get("&state")
        ;

        this.element().removeClass("--error");

        switch (state.type) {
            case "error":
                this.element().addClass("--error");
        }
    }
}

Input.MODE_ACTIVE = 'active';
Input.MODE_FOCUS = 'focus';

export default Input;
