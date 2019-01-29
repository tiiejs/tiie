import Widget from 'Tiie/Widgets/Widget';

import templateStructureCols from './resources/structureCols.html';

const cn = 'Range';

class Range extends Widget {
    constructor(state = {}) {
        super(`
            <div class="grid-x grid-padding-x" name="content">
            </div>
        `);

        let p = this.__private(cn, {
            widgets : [],
        });

        this.set('-structure', state.structure ? state.structure : 'cols');
        this.set('-value', state.value ? state.value : null);

        this.on([
            ':change'
        ], (event, params) => {
            this.reload();
        }, this.id());
        // this.on('structure', () => {
        //     this.reload();
        // }, this.id());

        // this.on('value', () => {
        //     this._reloadValue();
        // }, this.id());
    }

    _exportValue() {
        const p = this.__private(cn);

        let value = {},
            isNotNull = 0
        ;

        for (let i in p.widgets) {
            if (p.widgets[i].widget.get('value')) {
                isNotNull = 1;

                value[i] = p.widgets[i].widget.get('value');
            }
        }

        if (isNotNull) {
            this.set('value', value, {ommit : this.id()});
        } else {
            this.set('value', null, {ommit : this.id()});
        }
    }

    widget(id, widget) {
        let p = this.__private(cn),
            tmp,
            i
        ;

        switch (arguments.length) {
            case 0:
                this.log("Unsuported params", 'warn');
                return this;
            case 1:
                return p.widgets[id] ? p.widgets[id] : null;
            case 2:
                if (p.widgets[id]) {
                    // Detach old widget.
                    p.widgets[id].widget.off(this.id());
                    p.widgets[id].detach();
                }

                // Attach new
                p.widgets[id] = {
                    widget
                };

                // Attach to change event.
                p.widgets[id].widget.on('value', (event) => {
                    this._exportValue();
                }, this.id());

                if (this.get('value')) {
                    // set value
                    let value = this.get('&value');

                    if (value[id] === undefined) {
                        p.widgets[id].widget.set('value', null, {ommit : this.id()});
                    }else{
                        p.widgets[id].widget.set('value', value[id], {ommit : this.id()});
                    }
                }

                // Attach to dom.
                if (this.element(id)) {
                    p.widgets[id].target(this.element(id));

                    if (!p.widgets[id].is('rendered')) {
                        p.widget[id].render();
                    }
                }

                return this;
            default:
                this.log("Unsuported params", 'warn');
                return this;
        }
    }

    render() {
        super.render();

        let p = this.__private(cn);

        switch (this.get('structure')) {
            case 'cols':
                this.element().content(templateStructureCols);

                for (let i in p.widgets) {
                    // Sprawdzam czy istnieje element docelowy dla widgetu.

                    p.widgets[i].widget.target(this.element(i));

                    if (!p.widgets[i].widget.is('rendered')) {
                        p.widgets[i].widget.render()
                    }
                }

                break;
        }

        // Set value.
        let value = this.get('&value');

        if (value) {
            for (let i in p.widgets) {
                if (value[i] === undefined) {
                    p.widgets[i].widget.set('value', null, {ommit : this.id()});
                }else{
                    p.widgets[i].widget.set('value', value[i], {ommit : this.id()});
                }
            }
        }

        return this;
    }
}

export default Range;
