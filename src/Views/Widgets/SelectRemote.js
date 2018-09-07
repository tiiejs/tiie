import Widget from 'Topi/Views/Widgets/Widget';

const cn = 'SelectRemote';
class SelectRemote extends Widget {
    constructor(params = {}) {
        super(`<select class="topi-input-select" style='width : 100%'></select>`);

        if (params.endpoint === undefined) {
            throw ("SelectRemote needs defined endpoint.");
        }

        let p = this.private(cn, {
            inited : 0,
            endpoint : params.endpoint,
            items : [],
            templateResult : params.templateResult == undefined ? null : params.templateResult,
            templateSelection : params.templateSelection == undefined ? null : params.templateSelection,
        });

        this.set('-keyValue', params.keyValue === undefined ? 'id' : params.keyValue);
        this.set('-keyLabel', params.keyLabel === undefined ? 'name' : params.keyLabel);
        this.set('-multiple', params.multiple === undefined ? 0 : params.multiple);
        this.set('-items', params.items === undefined ? [] : params.items);

        // Flaga oznaczajaca czy select jest gotowy do uzycia
        this.set('-ready', null);

        // Group
        this.set('-group', params.group === undefined ? 0 : params.group);
        this.set('-placeholder', params.placeholder === undefined ? null : params.placeholder);
        this.set('-groupKey', params.groupKey === undefined ? 'parentId' : params.groupKey);
        this.set('-groupRootId', params.groupRootId === undefined ? null : params.groupRootId);

        this.set("-value", params.value).then(() => {
            this.set('ready', 1);
        }).catch(() => {
            this.set('ready', 0);
        });

        let multiple = this.get("multiple");

        if (multiple) {
            this.element().attr("multiple", "multiple");
        }else{
            this.element().removeAttr("multiple");
        }

        this.element().on('change', (event) => {
            let value = this.element().val();

            if (value === '') {
                value = null;
            }

            this.set('value', value, {ommit : this.id()});
        });

        this.on('value', (event) => {
            this.reload();
        }, this.id());
    }

    __setValue(target, name, value, emitparams = {}) {
        let p = this.private(cn),
            keyValue = this.get("keyValue"),
            multiple = this.get("multiple")
        ;

        if (name != 'value') {
            return super.__setValue(target, name, value, emitparams);
        }

        return new Promise((resolve, reject) => {
            // Szukam wartości na liście elementów

            if (typeof value == 'string' || typeof value == 'number') {
                // Szukam elementów, na liscie elementów w pierwszym kroku
                let item = this.get('&items').find(item => item[keyValue] == value);

                if (item != undefined) {
                    // element został znaleziony
                    this._setValues([item], resolve, reject, {
                        target,
                        name,
                        emitparams
                    });
                }else{
                    // Nie znalazłem elementu, szukam w API
                    p.endpoint.request((request) => {
                        request.resourceId(value);
                    }).promise().then((response) => {
                        this._setValues([response.data()], resolve, reject, {
                            target,
                            name,
                            emitparams
                        });

                    }).catch((response) => {
                        this.log(`Resouce ${value} not found`, "warn");

                        // Nie jest to błąd krytyczny
                        resolve();
                    });
                }
            }else if(Array.isArray(value)){
                let found = [];
                let notfound = [];

                value.forEach((v) => {
                    let id = null;

                    if (typeof v == 'string' || typeof v == 'number') {
                        id = v;
                    }else if(v.id != undefined){
                        id = v.id;
                    }

                    if (id !== null) {
                        // Szukam elementów, na liscie elementów
                        let item = this.get('&items').find(item => item[keyValue] == id);

                        if (item !== undefined) {
                            found.push(item);
                        }else{
                            notfound.push(id);
                        }
                    }else{
                        this.log(`Unknown type of value ${v}`, "warn");
                    }
                });

                if (notfound.length > 0) {
                    p.endpoint.request((request) => {
                        request.param("id", notfound);
                    }).promise().then((response) => {
                        response.data().forEach((item) => {
                            // Znalezione elementy dodaje do listy
                            found.push(item);
                        });

                        // Ustawiam wszystkie elementy
                        this._setValues(found, resolve, reject, {
                            target,
                            name,
                            emitparams
                        });

                    }).catch((response) => {
                        reject(response);
                    });
                }else{
                    // Wszystkie elementy zostały znalezione
                    this._setValues(found, resolve, reject, {
                        target,
                        name,
                        emitparams
                    });
                }
            }else{
                if (value != undefined && value != null) {
                    this._setValues([value], resolve, reject, {
                        target,
                        name,
                        emitparams
                    });
                }else{
                    this._setValues(value, resolve, reject, {
                        target,
                        name,
                        emitparams
                    });
                }
            }
        });
    }

    _setValues(values, resolve, reject, context) {
        let p = this.private(cn),
            keyValue = this.get("keyValue"),
            multiple = this.get("multiple")
        ;

        if (values === null || values === undefined) {
            if (multiple) {
                super.__setValue(context.target, context.name, [], context.emitparams);
            }else{
                super.__setValue(context.target, context.name, null, context.emitparams);
            }
        }else{
            // W innym przypadku powinna być to lista obiektów gotowych do
            // ustawienia.
            //
            // Najpierw szukam czy obiekty zostały już dodane.
            values.forEach((value) => {
                let found = 0;

                this.get('&items').forEach((item) => {
                    if (item[keyValue] == value[keyValue]) {
                        found = 1;
                    }
                });

                if (found == 0) {
                    // Wartości są dodawane do obiektu bez emitowania zdarzenia o
                    // zmienia. Ogólnie, emitowanie takiego zdarzenia, mogłoby
                    // spowodować wpicie się poda zmienę items, ale ta lista nie ma
                    // stałej ilości elementów i będzie sie dynamicznie zmieniać.
                    this.get('&items').push(value);
                }
            });

            if(multiple) {
                super.__setValue(context.target, context.name, values, context.emitparams);
            }else{
                if (values.length == 0) {
                    super.__setValue(context.target, context.name, null, context.emitparams);
                }else{
                    super.__setValue(context.target, context.name, values[0], context.emitparams);
                }
            }
        }

        resolve();

        return this;
    }

    render() {
        super.render();

        return new Promise((resolve, reject) => {
            let check = () => {
                let ready = this.get("ready");

                if (ready === null) {
                    // Co pół sekundy, sprawdzam czy select jest gotow - pobrał
                    // podstawowe dane
                    setTimeout(() => {
                        check();
                    }, 500);
                }else{
                    if (ready == 0) {
                        reject();
                    }else{
                        this._renderReady(resolve, reject);
                    }
                }
            };

            check();
        });

        // if (multiple == "1") {
        //     this.element().attr("multiple", "multiple");
        // }else{
        //     this.element().removeAttr("multiple");
        // }

        // if (!p.inited) {
        // }

        return this;
    }

    _renderReady(resolve, reject) {
        let p = this.private(cn),
            multiple = this.get("multiple"),
            keyValue = this.get("keyValue"),
            keyLabel = this.get("keyLabel"),
            value = this.get("value"),
            group = this.get("group"),
            groupKey = this.get("groupKey"),
            groupRootId = this.get("groupRootId"),
            placeholder = this.get("placeholder")
        ;

        if (p.inited == 0) {
            let value = this.get("value");

            let data = this.get('&items').filter((item) => {
                if (value === null) {
                    return 0;
                }

                if (Array.isArray(value)) {
                    return value.find(v => v[keyValue] == item[keyValue]) === undefined ? 0 : 1;
                }else{
                    return value[keyValue] == item[keyValue];
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
                // theme: "foundation",
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
        }
    }

    _addItems(values) {
        let p = this.private(cn),
            keyValue = this.get("keyValue")
        ;

        // Z listy podanych wartości, sprawdzam które juz są dodane, a które
        // trzeba dodać do listy.
        values.forEach((value) => {
            let found = 0;

            this.get('&items').forEach((item) => {
                if (item[keyValue] == value[keyValue]) {
                    found = 1;
                }
            });

            if (found == 0) {
                // Wartości są dodawane do obiektu bez emitowania zdarzenia o
                // zmienia. Ogólnie, emitowanie takiego zdarzenia, mogłoby
                // spowodować wpicie się poda zmienę items, ale ta lista nie ma
                // stałej ilości elementów i będzie sie dynamicznie zmieniać.
                this.get('&items').push(value);
            }
        });
    }
}

export default SelectRemote;
