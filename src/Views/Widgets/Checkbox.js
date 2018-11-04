import Widget from 'Topi/Views/Widgets/Widget';

const cn = 'Checkbox';
class Checkbox extends Widget {
    constructor(params = {}) {
        super(`<input type="checkbox" class="form-control">`, params);

        let p = this.__private(cn);

        this.set('-value', params.value == "1" ? 1 : 0);

        // Wpinam się na zmiane wartosci
        this.on([
            'value',
        ], () => {
            this.reload();
        }, this.id());

        // Prepare
        this.element().on('change', (event) => {
            this.set('value', this.element().prop('checked') ? 1 : 0, {ommit : this.id()});
        });
    }

    render() {
        super.render();

        let p = this.__private(cn),
            data = {
                value : this.get('value'),
            }
        ;

        if (data.value) {
            this.element().prop('checked', 1);
        }else{
            this.element().prop('checked', 0);
        }

        return this;
    }
}

export default Checkbox;
