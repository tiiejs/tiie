import Widget from 'Topi/Views/Widgets/Widget';

const cn = 'Textarea';
class Textarea extends Widget {
    constructor(params = {}) {
        super(`<textarea class="topi-textarea"></textarea>`);

        this.set('-value', params.value === undefined ? null : params.value);
        this.set('-height', params.height === undefined ? 300 : params.height);

        this.on([
            'value',
        ], () => {
            this.reload();
        }, this.id());

        this.element().on('change', (event) => {
            let value = this.element().val();
            this.set('value', value == "" ? null : value, {ommit : this.id()});
        });

        this.element().on("keyup", () => {
            this._autogrow();
        });
    }

    _autogrow() {
        let p = this.private(cn);

        let element = this.element().get(0);

        element.style.height = "5px";
        element.style.height = (element.scrollHeight + 10)+"px";
    }

    render() {
        super.render();

        let p = this.private(cn),
            value = this.get('value')
        ;

        // set height
        this.element().css("height", this.get('height'));

        if (value == null) {
            this.element().val("");
        }else{
            this.element().val(value);
        }

        this._autogrow();

        return this;
    }
}

export default Textarea;
