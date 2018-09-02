import Widget from 'Topi/Views/Widgets/Widget';

const cn = 'Select';
class Select extends Widget {
    constructor(params = {}) {
        super(`<select class="topi-input-select" style='width : 100%'></select>`);

        let p = this.private(cn, {
            inited : 0
        });

        this.set('-items', params.items === undefined ? [] : params.items);
        this.set('-keyValue', params.keyValue === undefined ? 'id' : params.keyValue);
        this.set('-keyLabel', params.keyLabel === undefined ? 'name' : params.keyLabel);
        this.set('-multiple', params.multiple === undefined ? 0 : params.multiple);
        this.set('-state', params.state === undefined ? {type : "default"} : params.state);

        // group
        this.set('-group', params.group === undefined ? 0 : params.group);
        this.set('-placeholder', params.placeholder === undefined ? null : params.placeholder);
        this.set('-groupKey', params.groupKey === undefined ? 'parentId' : params.groupKey);
        this.set('-groupRootId', params.groupRootId === undefined ? null : params.groupRootId);

        if (this.get('multiple')) {
            this.set('-value', params.value === undefined ? [] : params.value);

            if (this.get('value') === null) {
                this.set('-value', []);
            }
        }else{
            this.set('-value', params.value === undefined ? null : params.value);
        }

        this.element().on('change', (event) => {
            let value = this.element().val();

            if (value === '') {
                value = null;
            }

            this.set('value', value, {ommit : this.id()});
        });

        this.on('state', (event) => {
            this._reloadState();
        });

        this.on('value', (event) => {
            this.reload();
        }, this.id());
    }

    __setValue(target, name, value, emitparams = {}) {
        let p = this.private(cn),
            keyValue = this.get('keyValue'),
            multiple = this.get('multiple'),
            items = this.get('&items')
        ;

        if (name != "value") {
            return super.__setValue(target, name, value, emitparams);
        }

        if (value === undefined || value === null) {
            if (multiple) {
                return super.__setValue(target, name, [], emitparams);
            } else {
                return super.__setValue(target, name, null, emitparams);
            }
        }else if (typeof value == 'number' || typeof value == 'string') {
            // Wartosc jest numerem lub stringiem, oznacza to, że wartość
            // muszę znaleść na liście elementów
            let t = items.find(item => item[keyValue] == value);


            if (multiple) {
                if (t === undefined) {
                    return super.__setValue(target, name, [], emitparams);
                }else{
                    return super.__setValue(target, name, [t], emitparams);
                }
            }else{
                if (t === undefined) {
                    return super.__setValue(target, name, null, emitparams);
                }else{
                    return super.__setValue(target, name, t, emitparams);
                }
            }
        }else if(Array.isArray(value)){
            // Jest to lista wartości. Każdy element jest
            let toset = [];

            value.forEach((i) => {
                if (typeof i == "number" || typeof i == "string") {
                    let t = items.find(item => item[keyValue] == i);

                    if (t !== undefined) {
                        toset.push(t);
                    }

                }else if(Array.isArray(i)){
                    console.warn(`Wrong type of value for Select.`);
                }else{
                    toset.push(i);
                }
            });

            if (multiple) {
                if (toset.length > 0) {
                    return super.__setValue(target, name, toset, emitparams);
                }else{
                    return super.__setValue(target, name, [], emitparams);
                }
            }else{
                if (toset.length > 0) {
                    return super.__setValue(target, name, toset[0], emitparams);
                }else{
                    return super.__setValue(target, name, null, emitparams);
                }
            }
        }else{
            // Wartość jest podana jako obiekt
            return super.__setValue(target, name, value, emitparams);
        }
    }

    render() {
        super.render();

        let p = this.private(cn),
            value = this.get("value"),
            multiple = this.get('multiple'),
            keyValue = this.get('keyValue')
        ;

        if (p.inited == 0) {
            this._initSelect();

            p.inited = 1;
        }

        if (multiple) {
            let prepared = [];

            if (value.length > 0) {
                value.forEach((v) => {
                    prepared.push(v[keyValue]);
                });
            }

            this.element().val(prepared);
            this.element().trigger("change");
        }else{
            if (value !== null) {
                this.element().val(value[keyValue]);
                this.element().trigger("change");
            }else{
                this.element().val("");
                this.element().trigger("change");
            }
        }

        return this;
    }

    _reloadState() {
        return;
        let p = this.private(cn),
            state = this.get("&state")
        ;

        // let select2Container
        switch (state.type) {
            case "error":
                // this.element().select2({
                //     // adaptContainerCssClass : "pawel123"
                //     containerCssClass: "error"
                // });

                this.element().select2("container").addClass("error");
                break;
        }

        window.debugSelect2 = this.element();
    }

    _initSelect() {
        let p = this.private(cn),
            multiple = this.get("multiple"),
            items = this.get("&items"),
            keyValue = this.get("keyValue"),
            keyLabel = this.get("keyLabel"),
            value = this.get("value"),
            group = this.get("group"),
            groupKey = this.get("groupKey"),
            groupRootId = this.get("groupRootId"),
            placeholder = this.get("placeholder")
        ;

        if (multiple == "1") {
            this.element().attr("multiple", "multiple");
        }else{
            this.element().removeAttr("multiple");
        }

        let data = [];

        if (group == 1) {
            // Select jest grupowy
            let group = items.filter(item => item[groupKey] == groupRootId);

            data = group.map((group) => {
                return {
                    text : group[keyLabel],
                    children : items.filter(item => item[groupKey] == group[keyValue]).map((item) => {
                        let e = {
                            id : item[keyValue],
                            text : item[keyLabel],
                        };

                        if (value != null) {
                            if (multiple) {
                                if (value.some(t => t[keyValue] == item[keyValue])) {
                                    e.selected = true;
                                }
                            }else{
                                if (value[keyValue] == item[keyValue]) {
                                    e.selected = true;
                                }
                            }
                        }

                        return e;
                    })
                };
            });
        }else{
            // Select jest pojedyńczy
            data = items.map((item) => {
                let e = {
                    id : item[keyValue],
                    text : item[keyLabel],
                    selected : false,
                };

                if (multiple) {
                    if (value.length > 0) {
                        if (value.some(t => t[keyValue] == item[keyValue])) {
                            e.selected = true;
                        }
                    }
                }else{
                    if (value != null) {
                        if (value[keyValue] == item[keyValue]) {
                            e.selected = true;
                        }
                    }
                }

                return e;
            })
        }

        // data.unshift({
        //     id : "",
        //     text : placeholder
        // });

        if (placeholder) {
            this.element().select2({
                // theme: "foundation",
                placeholder,
                allowClear: true,
                data,
            });
        }else{
            this.element().select2({
                // theme: "foundation",
                data,
            });
        }
    }
}

export default Select;
