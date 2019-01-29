import Widget from 'Tiie/Widgets/Widget';

import style from './resources/style.scss';

const cn = 'Checkbox';
class Checkbox extends Widget {
    constructor(data = {}) {
        super(`
            <div class="tiie-ws-checkbox">
                <label class="container">
                    <span name="label"></span>
                    <input class="tiie-ws-checkbox__checkbox" type="checkbox" checked="checked" name="checkbox">
                    <span class="checkmark"></span>
                </label>
            </div>
        `);

        let p = this.__private(cn);

        this.__initState({
            label : {type : "string", default : null},
            value : {type : "boolean", default : 0, notNull : 1},
        }, data);

        this.on([
            'value',
            'label',
        ], () => {
            this.reload();
        }, this.id());

        // Prepare.
        this.element('checkbox').on('change', (event) => {
            this.set('value', this.$(event.currentTarget).prop('checked') ? 1 : 0, {ommit : this.id()});

            event.stopPropagation();
        });
    }

    render() {
        super.render();

        let p = this.__private(cn),
            value = this.get('value'),
            label = this.get('label')
        ;

        if (value) {
            this.element('checkbox').prop('checked', 1);
        } else {
            this.element('checkbox').prop('checked', 0);
        }

        if (this.__boolean(label)) {
            this.element('label').html(label);
        } else {
            this.element('label').html('');
        }

        return this;
    }
}

export default Checkbox;
