import Widget from 'Topi/Views/Widgets/Widget';

// import Widget from

const cn = 'Range';
class Range extends Widget {
    constructor(params = {}) {
        super(`
            <div class="grid-x grid-padding-x" name="content">
            </div>
        `);

        let p = this.private(cn, {
            widgets : [],
        });

        this.set('-structure', params.structure === undefined ? 'cols' : parastructure);
        this.set('-value', params.value === undefined ? {} : paravalue);

        this.on('structure', () => {
            this.reload();
        }, this.id());

        this.on('value', () => {
            this._reloadValue();
        }, this.id());
    }

    widget(id, widget) {
        let p = this.private(cn),
            tmp,
            i
        ;

        switch (arguments.length) {
            case 0:
                this.log("Unsuported params", 'warn');
                return this;
            case 1:
                return p.widgets[id] === undefined ? null : p.widgets[id].widget;
            case 2:
                if (p.widgets[id] != undefined) {
                    // Usuwam wszystkie eventy
                    p.widgets[id].widget.off(this.id());

                    // odpinam widget
                    p.widgets[id].detach();
                }

                p.widgets[id] = {
                    widget
                };

                // on change
                p.widgets[id].widget.on('value', (event) => {
                    let value = this.get('value');

                    value[id] = event.this.get("value");

                    this.set("value", value, {ommit : this.id()});
                }, this.id());

                // set value
                let value = this.get('&value');

                if (value[id] === undefined) {
                    p.widgets[id].widget.set('value', null, {ommit : this.id()});
                }else{
                    p.widgets[id].widget.set('value', value[id], {ommit : this.id()});
                }

                // set target
                let target = this.element(id);

                if (target != null) {
                    p.widgets[id].target(target);

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

    _reloadValue() {
        let p = this.private(cn),
            value = this.get('&value'),
            i
        ;

        for (i in p.widgets) {
            if (value[i] === undefined) {
                p.widgets[i].widget.set('value', null, {ommit : this.id()});
            }else{
                p.widgets[i].widget.set('value', value[i], {ommit : this.id()});
            }
        }
    }

    render() {
        super.render();

        let p = this.private(cn),
            i,
            target
        ;

        switch (this.get('structure')) {
            case 'cols':
                this.element().content(`
                    <div class="cell small-6 medium-12 large-6" name="from"></div>
                    <div class="cell small-6 medium-12 large-6" name="to"></div>
                `);

                for (i in p.widgets) {
                    // Sprawdzam czy istnieje element docelowy dla widgetu.
                    target = this.element(i);

                    if (target == null) {
                        this.error('warn', `Undefined target ${i} for Range.`);
                        return;
                    }

                    p.widgets[i].widget.target(target);

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
