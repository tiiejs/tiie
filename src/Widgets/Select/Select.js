import Widget from 'Tiie/Widgets/Widget';

import style from './resources/style.scss';

const cn = "Select";

class Select extends Widget {
    constructor(state = {}) {
        super(`<select class="tiie-input-select" style='width : 100%'></select>`);

        let p = this.__private(cn, {
            inited : 0
        });

        this.set('-items', state.items === undefined ? [] : state.items);
        this.set('-keyValue', state.keyValue === undefined ? "id" : state.keyValue);
        this.set('-keyLabel', state.keyLabel === undefined ? "name" : state.keyLabel);
        this.set('-multiple', state.multiple === undefined ? 0 : state.multiple);
        this.set('-state', state.state === undefined ? {type : "default"} : state.state);

        // Group
        this.set('-group', state.group === undefined ? 0 : state.group);
        this.set('-placeholder', state.placeholder === undefined ? null : state.placeholder);
        this.set('-groupKey', state.groupKey === undefined ? "parentId" : state.groupKey);
        this.set('-groupRootId', state.groupRootId === undefined ? null : state.groupRootId);
        this.set('-value', state.value === undefined ? null : state.value);

        // if (this.get("multiple")) {
        //     this.set('-value', state.value === undefined ? [] : state.value);

        //     if (this.get("value") === null) {
        //         this.set('-value', []);
        //     }
        // }else{
        //     this.set('-value', state.value === undefined ? null : state.value);
        // }

        this.element().on("change", (event) => {
            let value = this.element().val();

            if (value) {
                this.set("value", value, {ommit : this.id()});
            } else {
                this.set("value", null, {ommit : this.id()});
            }
        });

        this.on("state", (event) => {
            this._reloadState();
        });

        this.on("value", (event) => {
            this.reload();
        }, this.id());
    }

    __setValue(target, name, value, emitparams = {}) {
        if (name == "value") {
            if (this.__boolean(this.get("multiple"))) {
                if (value instanceof Array) {
                    return super.__setValue(target, name, value, emitparams);
                } else {
                    return super.__setValue(target, name, [value], emitparams);
                }
            } else {
                return super.__setValue(target, name, value, emitparams);
            }
        } else if (name == "multiple") {
            return super.__setValue(target, name, this.__boolean(value), emitparams);
        } else if (name == "group") {
            return super.__setValue(target, name, this.__boolean(value), emitparams);
        } else {
            return super.__setValue(target, name, value, emitparams);
        }
    }

    render() {
        super.render();

        const p = this.__private(cn);

        let items = this.get("&items"),
            keyValue = this.get("keyValue"),
            keyLabel = this.get("keyLabel"),
            value = this.get("value"),
            placeholder = this.get("placeholder")
        ;

        if (this.is("multiple")) {
            this.element().attr("multiple", "multiple");
        }else{
            this.element().removeAttr("multiple");
        }

        if (!p.inited) {
            p.inited = 1;

            if (placeholder) {
                this.element().select2({
                    placeholder,
                    containerCssClass : "em-widgets-select-remote__select-container",
                    allowClear: true,
                });
            }else{
                this.element().select2();
            }
        }

        this.element().select2({
            data : this._prepare(),
            containerCssClass : "em-widgets-select-remote__select-container",
        });

        this.element().val(value);
        this.element().trigger("change");

        return this;
    }

    _prepare() {
        const p = this.__private(cn);

        let multiple = this.is("multiple"),
            items = this.get("&items"),
            keyValue = this.get("keyValue"),
            keyLabel = this.get("keyLabel"),
            value = this.get("&value"),
            placeholder = this.get("placeholder")
        ;

        // Select jest pojedyńczy.
        let prepared = items.map((item) => {
            let e = {
                id : item[keyValue],
                text : item[keyLabel],
                selected : false,
            };

            if (multiple) {
                if (value.some(v => v == item[keyValue])) {
                    e.selected = true;
                }
            }else{
                if (value == item[keyValue]) {
                    e.selected = true;
                }
            }

            return e;
        });

        return prepared;
    }

    _reloadState() {
        return;

        let p = this.__private(cn),
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
    }

    remove() {
        const p = this.__private(cn);

        this.element().select2('remove');

        return super.remove();
    }

    _initSelect() {
        const p = this.__private(cn);

        let multiple = this.get("multiple"),
            items = this.get("&items"),
            keyValue = this.get("keyValue"),
            keyLabel = this.get("keyLabel"),
            value = this.get("value"),
            group = this.get("group"),
            groupKey = this.get("groupKey"),
            groupRootId = this.get("groupRootId"),
            placeholder = this.get("placeholder")
        ;

        let data = [];

        if (group) {
            // // Select jest grupowy
            // let group = items.filter(item => item[groupKey] == groupRootId);

            // data = group.map((group) => {
            //     return {
            //         text : group[keyLabel],
            //         children : items.filter(item => item[groupKey] == group[keyValue]).map((item) => {
            //             let e = {
            //                 id : item[keyValue],
            //                 text : item[keyLabel],
            //             };

            //             if (value != null) {
            //                 if (multiple) {
            //                     if (value.some(t => t[keyValue] == item[keyValue])) {
            //                         e.selected = true;
            //                     }
            //                 }else{
            //                     if (value[keyValue] == item[keyValue]) {
            //                         e.selected = true;
            //                     }
            //                 }
            //             }

            //             return e;
            //         })
            //     };
            // });
        }else{
            // Select jest pojedyńczy.
            data = items.map((item) => {
                let e = {
                    id : item[keyValue],
                    text : item[keyLabel],
                    selected : false,
                };

                if (multiple) {
                    if (value.some(v => v == item[keyValue])) {
                        e.selected = true;
                    }
                }else{
                    if (value == item[keyValue]) {
                        e.selected = true;
                    }
                }

                return e;
            })
        }

    }
}

export default Select;
