import Widget from 'Tiie/Widgets/Widget';

const cn = 'Span';
class Span extends Widget {
    constructor(params = {}) {
        super(`<span></span>`);

        const p = this.__private(cn);

        this.set('-value', params.value === undefined ? null : params.value);

        this.on([
            'value',
        ], () => {
            this.reload();
        }, this.id());
    }

    render() {
        super.render();

        const p = this.__private(cn),
            value = this.get('&value')
        ;

        if(value == null){
            this.element().html("");
        }else{
            this.element().html(value);
        }

        return this;
    }
}

export default Span;
