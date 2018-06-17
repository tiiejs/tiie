import Widget from 'Topi/Views/Widgets/Widget';

const cn = 'Textarea';
class Textarea extends Widget {
    constructor(params = {}) {
        super(`<textarea class="form-control"></textarea>`);

        this.set('-value', params.value === undefined ? null : params.value);

        this.on([
            'value',
        ], () => {
            this.reload();
        }, this.id());

        this.element().on('change', (event) => {
            let value = this.element().val();
            this.set('value', value == "" ? null : value, {ommit : this.id()});
        });
    }

    render() {
        super.render();

        let p = this.private(cn),
            value = this.get('value')
        ;


        if (value == null) {
            this.element().val("");
        }else{
            this.element().val(value);
        }

        return this;
    }
}

export default Textarea;
