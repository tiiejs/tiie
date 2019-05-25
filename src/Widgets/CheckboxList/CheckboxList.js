import Widget from "Tiie/Widgets/Widget";
import WCheckbox from 'Tiie/Widgets/Checkbox/Checkbox';

import style from './resources/style.scss';

const cn = "CheckboxList";

class CheckboxList extends Widget {
    constructor(data = {}) {
        super(`
            <div class="tiie-checkbox-list">
                <div class="tiie-checkbox-list__items" name="items"></div>
                <div name="all"></div>
            </div>
        `)

        const p = this.__private(cn, {
            checkboxes : {},
        });

        this.__initState({
            items : {type : "array", default : [], notNull : 1},
            keyValue : {type : "string", default : 'id', notNull : 1},
            keyLabel : {type : "string", default : 'name', notNull : 1},
            multiple : {type : "boolean", default : 0, notNull : 1},
            state : {type : "object", default : null},
        }, data);

        this.set("-value", data.value);

        this.on([
            "items",
            "keyValue",
            "keyLabel",
            "multiple",
            "state",
            "value",
        ], (event, params) => {
            this.reload();
        }, this.id());
    }

    __setValue(target, name, value, emitparams = {}) {
        if (name == "multiple") {
            // Present value.
            let objectValue = this.get('value');

            if (this.__boolean(value)) {
                if (Array.isArray(objectValue)) {
                    if (!objectValue.some(v => v == value)) {
                        objectValue.push(value);
                    }
                } else {
                    if (objectValue == null) {
                        objectValue = [];
                    } else {
                        objectValue = [objectValue];
                    }
                }
            } else {
                if (Array.isArray(objectValue)) {
                    if (objectValue.length) {
                        objectValue = objectValue.shift();
                    } else {
                        objectValue = null;
                    }
                }
            }

            let result = super.__setValue(target, name, value, emitparams);

            this.set('value', objectValue);

            return result;
        } else if(name == "value") {
            if (this.is('multiple')) {
                if (value == null) {
                    value = [];
                } else if(!Array.isArray(value)) {
                    value = [value];
                }
            } else {
                if (Array.isArray(value)) {
                    this.__log('Nieprawidłowy typ danych dla typu nie wielokrotnego.', 'warn', 'Tiie.Widgets.CheckboxList');

                    if (value.length) {
                        value = value.shift();
                    } else {
                        value = null;
                    }
                }
            }

            return super.__setValue(target, name, value, emitparams);
        } else {
            return super.__setValue(target, name, value, emitparams);
        }
    }

    render() {
        const p = this.__private(cn),
            keyValue = this.get("&keyValue"),
            keyLabel = this.get("&keyLabel"),
            multiple = this.get("&multiple"),
            value = this.get("&value"),
            state = this.get("&state"),
            present = {}
        ;

        this.get("&items").forEach((item) => {
            let checkboxValue = 0;

            if (this.is('multiple')) {
                checkboxValue = value.some(v => v == item[keyValue]) ? 1 : 0;
            } else {
                checkboxValue = value == item[keyValue] ? 1 : 0;
            }

            if (p.checkboxes[item[keyValue]]) {
                p.checkboxes[item[keyValue]].set('value', checkboxValue, {ommit : this.id()});
                p.checkboxes[item[keyValue]].set('label', item[keyLabel], {ommit : this.id()});
            } else {
                p.checkboxes[item[keyValue]] = new WCheckbox({
                    value : checkboxValue,
                    label : item[keyLabel],
                });

                p.checkboxes[item[keyValue]]
                    .target(this.element("items"))
                    .on("value:change", (event, params) => {
                        let value = this.get('value');

                        if (this.is('multiple')) {
                            if (this.__boolean(event.this.get('value'))) {
                                value.push(item[keyValue]);

                                this.set('value', value);
                            } else {
                                value = value.filter(v => v != item[keyValue]);

                                this.set('value', value);
                            }
                        } else {
                            if (this.__boolean(event.this.get('value'))) {
                                this.set('value', item[keyValue]);
                            } else {
                                this.set('value', null);
                            }
                        }
                    }, this.id())
                    .render()
                ;
            }
        });

        return this;
    }
}

export default CheckboxList;
