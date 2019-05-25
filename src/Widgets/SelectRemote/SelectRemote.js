import Widget from 'Tiie/Widgets/Widget';

import style from './resources/style.scss';

const cn = 'SelectRemote';

class SelectRemote extends Widget {
    constructor(data = {}, params = {}) {
        super(`<select class="tiie-input-select" style='width : 100%'></select>`);

        console.log('SelectRemote.constructor');

        if (params.endpoint == undefined) {
            this.__log(`SelectRemote need endpoint defined.`, "error", "Tiie.Widgets.SelectRemote");

            return;
        }

        const p = this.__private(cn, {
            inited : 0,
            endpoint : params.endpoint,

            templateResult : params.templateResult == undefined ? null : params.templateResult,
            templateSelection : params.templateSelection == undefined ? null : params.templateSelection,
        });

        this.__define("data.structure", {
            keyValue : {type : "string", default : "id", notNull : 1},
            keyName : {type : "string", default : "name", notNull : 1},
            multiple : {type : "boolean", default : 0, notNull : 1},
            items : {type : "array", default : [], notNull : 1},
            search : {type : "string", default : null, notNull : 0},

            group : {type : "boolean", default : 0, notNull : 1},
            placeholder : {type : "string", default : null, notNull : 0},
            groupKey : {type : "string", default : "parentId", notNull : 1},
            groupRootId : {type : "string", default : null, notNull : 0},
        });

        this.set(data, {silently : 1, defined : 1});

        console.log('SelectRemote.set value');
        // Type of value is dependent if is multiple or not.
        // this.set('-value', data.value == undefined ? this.get('multiple') ? [] : null : data.value);
        this.set('-value', data.value == undefined ? null : data.value);

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
            'keyName',
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
            console.log('SelectRemote.__setValue', value);
            console.trace();

            if (value === null || value === undefined || (Array.isArray(value) && value.length == 0)) {
                super.__setValue(target, name, this.is("multiple") ? [] : null, emitparams);

                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                if (typeof value == "string" || typeof value == "number") {
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
                            this.set("@syncing", 0, {syncing : 1});

                            let items = this.get("items");

                            items.push(response.data());

                            this.set("items", items, {ommit : this.id()});

                            if (multiple) {
                                super.__setValue(target, name, [value], emitparams);
                            } else {
                                super.__setValue(target, name, value, emitparams);
                            }

                            resolve();
                        }).catch((response) => {
                            this.__log(`Item ${value} not found.`, "warn");

                            this.set("@syncing", 0, {syncing : 1});

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
                            this.__log(`Unknown type of value ${v}`, "warn", "tiie.views.widgets.select-remote");
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

                            this.set("@syncing", 0, {syncing : 1});

                            resolve();
                        }).catch((response) => {
                            this.set("@syncing", 0, {syncing : 1});

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

        console.log('SelectRemote.render', this.get("@syncing"));

        let multiple = this.get("multiple"),
            keyValue = this.get("keyValue"),
            keyName = this.get("keyName"),
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
                text : item[keyName],
                selected : 1
            };
        });

        console.log('data', data);

        let select2 = {
            data,
            containerCssClass : "em-widgets-select-remote__select-container",
            ajax: {
                delay: 250,
                url : p.endpoint.uri(),
                data: (params) => {
                    return {
                        [keyName] : params.term
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
        this.element().select2("refresh");

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
