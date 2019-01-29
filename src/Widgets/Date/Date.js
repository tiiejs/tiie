import Widget from "Tiie/Widgets/Widget";

const cn = "Date";

/**
 * Widget to display date.
 *
 * @param {Object} params
 *     value
 *     placeholder
 *     type
 *     state
 */
class Date extends Widget {
    constructor(params = {}) {
        super(`<input class="tiie-input">`, params);

        const p = this.__private(cn);

        this.set("-value", params.value === undefined ? null : params.value);
        this.set("-placeholder", params.placeholder === undefined ? null : params.placeholder);
        this.set("-type", params.type === undefined ? null : params.type);
        this.set("-state", params.state === undefined ? {type : "default"} : params.state);
        this.set("-format", params.format === undefined ? 'Y-m-d' : params.format);

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

        this.element().datetimepicker({
            // i18n:{
            //     de:{
            //         months:[
            //             'Januar','Februar','März','April',
            //             'Mai','Juni','Juli','August',
            //             'September','Oktober','November','Dezember',
            //         ],
            //         dayOfWeek:[
            //             "So.", "Mo", "Di", "Mi",
            //             "Do", "Fr", "Sa.",
            //         ]
            //     }
            // },
            timepicker : false,
            format : this.get('format'),
        });

        this.element().change((event) => {
            this.set('value', event.currentTarget.value);
        });
    }

    /**
     * Render Date
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

        if (value == null) {
            this.element().val("");
        }else{
            this.element().val(value);
        }

        this._reloadState();

        return this;
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

export default Date;
