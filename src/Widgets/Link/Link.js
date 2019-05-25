import Widget from "Tiie/Widgets/Widget";

const cn = "Link";

class Link extends Widget {
    constructor(data = {}, params = {}) {
        super(`<a class="tiie-link" href=""></a>`, data);

        let p = this.__private(cn);

        this.__define("data.structure", {
            value : {type : "string", default : null},
            label : {type : "string", default : null},
        });

        this.set(data, {silently : 1, defined : 1});

        this.on([
            "value",
            "label",
        ], () => {
            this.reload();
        }, this.id());
    }

    /**
     * Render Link
     */
    render() {
        super.render();

        let p = this.__private(cn),
            value = this.get("value"),
            label = this.get("label")
        ;

        if (label == null) {
            label = value;
        }

        this.element().attr("href", value);
        this.element().html(label);

        return this;
    }
}

export default Link;
