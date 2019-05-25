import Widget from 'Tiie/Widgets/Widget';

import templateStructureCols from './resources/structureCols.html';

const cn = 'Range';

class Range extends Widget {
    constructor(data = {}) {
        super(`<div class="grid-x grid-padding-x" name="content"></div>`);

        let p = this.__private(cn, {
            widgets : [],
        });

        this.set('-structure', data.structure ? data.structure : 'cols');
        this.set('-value', data.value ? data.value : {});

        this.on([
            'structure:change',
        ], (event, params) => {
            this.reload();
        }, this.id());

        this.on([
            'value:change',
        ], (event, params) => {
            this._reloadValue();
        }, this.id());
    }

    _exportValue() {
        let p = this.__private(cn),
            value = {},
            isNotNull = 0
        ;

        console.log('_exportValue', value);

        for (let i in p.widgets) {
            // if (p.widgets[i].widget.get('value')) {
            //     isNotNull = 1;

            //     value[i] = p.widgets[i].widget.get('value');
            // }

            value[i] = p.widgets[i].widget.get('value');
        }

        this.set('value', value, {ommit : this.id()});
    }

    _reloadValue() {
        let p = this.__private(cn),
            value = this.get("&value")
        ;

        // Set value.
        if(value == null) {
            for (let i in p.widgets) {
                p.widgets[i].widget.set("value", null, {ommit : this.id()});
            }
        } else {
            for (let i in p.widgets) {
                if (value[i] == undefined) {
                    p.widgets[i].widget.set("value", null, {ommit : this.id()});
                }else{
                    p.widgets[i].widget.set("value", value[i], {ommit : this.id()});
                }
            }
        }
    }

    widget(id, widget) {
        let p = this.__private(cn),
            tmp,
            i
        ;

        console.log("widget", id, widget);
        switch (arguments.length) {
            case 0:
                this.__log("Unsuported params", 'warn');
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
                    console.log('Range.value.change');
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
                this.__log("Unsuported params", 'warn');
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

        return this;
    }
}

export default Range;
