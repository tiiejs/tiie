import Widget from 'Tiie/Widgets/Widget';

import style from './resources/style.scss';

const cn = 'SelectRemote';

class SelectRemote extends Widget {
    constructor(state = {}, params = {}) {
        super(`<select class="tiie-input-select" style='width : 100%'></select>`);

        if (params.endpoint == undefined) {
            this.log(`SelectRemote need endpoint defined.`, 'warn');

            return;
        }

        let p = this.__private(cn, {
            inited : 0,
            endpoint : params.endpoint,
            templateResult : params.templateResult == undefined ? null : params.templateResult,
            templateSelection : params.templateSelection == undefined ? null : params.templateSelection,
        });

        this.set('-keyValue', state.keyValue == undefined ? 'id' : state.keyValue);
        this.set('-keyLabel', state.keyLabel == undefined ? 'name' : state.keyLabel);
        this.set('-multiple', state.multiple == undefined ? 0 : state.multiple);
        this.set('-items', state.items == undefined ? [] : state.items);

        // Group
        this.set('-group', state.group == undefined ? 0 : state.group);
        this.set('-placeholder', state.placeholder == undefined ? null : state.placeholder);
        this.set('-groupKey', state.groupKey == undefined ? 'parentId' : state.groupKey);
        this.set('-groupRootId', state.groupRootId == undefined ? null : state.groupRootId);

        this.set('-value', state.value == undefined ? this.get('multiple') ? [] : null : state.value);

        this.element().on('change', (event) => {
            let value = this.element().val();

            if (value === '') {
                value = null;
            }

            this.set('value', value, {ommit : this.id()});
        });

        this.on([
            'value',
            'keyValue',
            'keyLabel',
            'multiple',
            'items',
            'group',
            'placeholder',
            'groupKey',
            'groupRootId',
        ], (event) => {
            this.reload();
        }, this.id());
    }

    __setValue(target, name, value, emitparams = {}) {
        let p = this.__private(cn),
            keyValue = this.get("keyValue"),
            multiple = this.get("multiple")
        ;

        if (name == "value") {
            return new Promise((resolve, reject) => {
                if (typeof value == 'string' || typeof value == 'number') {
                    // I'm looking for element at items list.
                    if (this.get("&items").some(item => item[keyValue] == value)) {
                        // Element was found. Then I set value.
                        if (multiple) {
                            super.__setValue(target, name, [value], emitparams);
                        } else {
                            super.__setValue(target, name, value, emitparams);
                        }

                        resolve();
                    }else{
                        // Object was not found. Then I fetch object from API and
                        // add to items.

                        this.set("@syncing", 1);

                        p.endpoint.request((request) => {
                            request.resourceId(value);
                        }).promise().then((response) => {
                            this.set("@syncing", 0);

                            let items = this.get('items');

                            items.push(response.data());

                            this.set("items", items, {ommit : this.id()});
                            // this.set("items", items);

                            if (multiple) {
                                super.__setValue(target, name, [value], emitparams);
                            } else {
                                super.__setValue(target, name, value, emitparams);
                            }

                            resolve();
                        }).catch((response) => {
                            this.log(`Item ${value} not found.`, "warn");

                            this.set("@syncing", 0);

                            resolve();
                        });
                    }
                }else if(Array.isArray(value)) {
                    let found = [],
                        notfound = []
                    ;

                    value.forEach((v) => {
                        let id = null;

                        if (typeof v == 'string' || typeof v == 'number') {
                            id = v;
                        }else if(v[keyValue] != undefined){
                            id = v[keyValue];
                        }

                        if (id !== null) {
                            // I'm looking for element at items list.
                            if (this.get("&items").some(item => item[keyValue] == id)) {
                                found.push(id);
                            }else{
                                notfound.push(id);
                            }
                        }else{
                            this.log(`Unknown type of value ${v}`, "warn", "tiie.views.widgets.select-remote");
                        }
                    });

                    if (notfound.length > 0) {

                        this.set("@syncing", 1);

                        p.endpoint.request((request) => {
                            request.param("id", notfound);
                        }).promise().then((response) => {
                            response.data().forEach((item) => {
                                // Znalezione elementy dodaje do listy
                                found.push(item[keyValue]);
                            });

                            if (multiple) {
                                super.__setValue(target, name, found, emitparams);
                            } else {
                                super.__setValue(target, name, found[0], emitparams);
                            }

                            this.set("@syncing", 0);

                            resolve();
                        }).catch((response) => {
                            this.set("@syncing", 0);

                            reject(response);
                        });
                    }else{
                        if (multiple) {
                            super.__setValue(target, name, found, emitparams);
                        } else {
                            super.__setValue(target, name, found[0], emitparams);
                        }

                        resolve();
                    }
                }
            });
        } else if (
            name == "multiple" ||
            name == "group"
        ) {
            super.__setValue(target, name, this.__boolean(value), emitparams);

            return Promise.resolve();
        } else {
            super.__setValue(target, name, value, emitparams);

            return Promise.resolve();
        }
    }

    remove() {
        const p = this.__private(cn);

        this.element().select2('destroy');

        return super.remove();
    }

    render() {
        super.render();

        const p = this.__private(cn);

        if (this.__boolean(this.get('@syncing'))) {
            setTimeout(() => {
                this.render();
            }, 1000);

            return this;
        }

        let multiple = this.get("multiple"),
            keyValue = this.get("keyValue"),
            keyLabel = this.get("keyLabel"),
            value = this.get("value"),
            group = this.get("group"),
            groupKey = this.get("groupKey"),
            groupRootId = this.get("groupRootId"),
            placeholder = this.get("placeholder")
        ;

        let data = this.get('&items').filter((item) => {
            if (value === null) {
                return 0;
            }

            if (Array.isArray(value)) {
                return value.some(v => v[keyValue] == item[keyValue]);
            }else{
                return value == item[keyValue];
            }
        }).map((item) => {
            return {
                id : item[keyValue],
                text : item[keyLabel],
                selected : 1
            };
        });

        let select2 = {
            data,
            containerCssClass : "em-widgets-select-remote__select-container",
            ajax: {
                delay: 250,
                url : p.endpoint.uri(),
                data: (params) => {
                    return {
                        [keyLabel] : params.term
                    };
                },
                processResults: (data) => {
                    this._addItems(data);

                    return {
                        results : data.map((item) => {
                            return {
                                id : item.id,
                                text : item.name,
                            }
                        })
                    };
                }
            },
        };

        if (placeholder) {
            select2.placeholder = placeholder;
        }

        if (p.templateResult) {
            select2.templateResult = p.templateResult;
        }

        if (p.templateSelection) {
            select2.templateSelection = p.templateSelection;
        }

        this.element().select2(select2);

        return this;
    }

    _addItems(values) {
        let p = this.__private(cn),
            keyValue = this.get("keyValue")
        ;

        let items = this.get('&items');

        // Z listy podanych wartości, sprawdzam które juz są dodane, a które
        // trzeba dodać do listy.
        values.forEach((value) => {
            let found = 0;

            items.forEach((item) => {
                if (item[keyValue] == value[keyValue]) {
                    found = 1;
                }
            });

            if (found == 0) {
                // Wartości są dodawane do obiektu bez emitowania zdarzenia o
                // zmienia. Ogólnie, emitowanie takiego zdarzenia, mogłoby
                // spowodować wpicie się poda zmienę items, ale ta lista nie ma
                // stałej ilości elementów i będzie sie dynamicznie zmieniać.
                items.push(value);
            }
        });

        this.set('items', items, {ommit : this.id()});
    }
}

export default SelectRemote;
