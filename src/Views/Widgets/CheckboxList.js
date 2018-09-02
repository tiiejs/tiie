import Widget from "Topi/Views/Widgets/Widget";

import templateLayout from 'Topi/Views/Widgets/CheckboxList.layout.html';

const cn = "CheckboxList";
/**
 * Widget to display list of checkbox.
 *
 * - items
 * - keyValue
 * - keyLabel
 * - multiple
 * - state
 * - search
 * - all
 * - border Add border to widget
 * - group
 * - groupKey
 * - groupRootId
 *
 */
class CheckboxList extends Widget {
    constructor(params = {}) {
        super(templateLayout, params);

        const p = this.private(cn);

        this.set("-items", params.items === undefined ? [] : params.items);
        this.set("-keyValue", params.keyValue === undefined ? "id" : params.keyValue);
        this.set("-keyLabel", params.keyLabel === undefined ? "name" : params.keyLabel);
        this.set("-multiple", params.multiple === undefined ? 0 : params.multiple);
        this.set("-state", params.state === undefined ? {type : "default"} : params.state);
        this.set("-search", params.search === undefined ? "search" : params.search);
        this.set("-all", params.all === undefined ? 0 : params.all);
        this.set("-border", params.border === undefined ? 0 : params.border);

        // group
        this.set("-group", params.group === undefined ? 0 : params.group);
        this.set("-groupKey", params.groupKey === undefined ? "parentId" : params.groupKey);
        this.set("-groupRootId", params.groupRootId === undefined ? null : params.groupRootId);

        // set value
        if (params.value === undefined) {
            if (this.get("multiple")) {
                this.set("-value", []);
            }else{
                this.set("-value", null);
            }
        }else{
            this.set("-value", params.value);
        }

        this.element("items").on("click", ".__checkbox", (event) => {
            const target = this.$(event.target),
                id = target.data("id"),
                multiple = this.get("multiple"),
                value = this.get("value"),
                keyValue = this.get("keyValue")
            ;

            if (target.is(":checked")) {
                if (multiple) {
                    if (value.find(item => item[keyValue] == id) === undefined) {
                        value.push(id);

                        this.set("value", value);
                    }
                }else{
                    this.set("value", id);
                }
            }else{
                if (multiple) {
                    this.set("value", value.filter(item => item[keyValue] != id));
                }else{
                    this.set("value", null);
                }
            }

            event.stopPropagation();
            event.preventDefault();
        });

        this.element("all").click((event) => {
            if (this.get("all")) {
                this.set("all", 0);
            }else{
                this.set("all", 1);
            }

            event.stopPropagation();
            event.preventDefault();
        });

        this.on([
            "items",
            "keyValue",
            "keyLabel",
            "multiple",
            "group",
            "groupKey",
            "groupRootId",
            "border",
        ], (event) => {
            this.reload();
        }, this.id());

        this.on("all", (event) => {
            this._reloadAll();
        }, this.id());

        this.on("search", (event) => {
            this._reloadSearch();
        }, this.id());

        this.on("state", (event) => {
            this._reloadState();
        }, this.id());

        this.on("value", (event) => {
            this.reload();
        }, this.id());
    }

    __setValue(target, name, value, emitparams = {}) {
        let p = this.private(cn),
            keyValue = this.get("keyValue"),
            multiple = this.get("multiple"),
            items = this.get("&items")
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
        }else if (typeof value == "number" || typeof value == "string") {
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
            // it's list of value. Each item, can be object or number or
            // string. If is string, then we transform value to object
            let toset = [];

            value.forEach((i) => {

                if (typeof i == "number" || typeof i == "string") {
                    let t = items.find(item => item[keyValue] == i);

                    if (t !== undefined) {
                        toset.push(t);
                    }

                }else if(Array.isArray(i)){
                    this.log(`Wrong type of value for CheckboxList.`, "warn");
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
            multiple = this.get("multiple"),
            items = this.get("&items"),
            keyValue = this.get("keyValue"),
            keyLabel = this.get("keyLabel"),
            value = this.get("value"),
            group = this.get("group"),
            groupKey = this.get("groupKey"),
            groupRootId = this.get("groupRootId")
        ;

        let itemsHtml = items.map((item) => {
            return `
                <div class="__item" data-id="${item[keyValue]}">
                    <input class="__checkbox" type="checkbox" data-id="${item[keyValue]}"><label class="__label">${item[keyLabel]}</label>
                </div>
            `
        }).join('');

        this.element("items").html(itemsHtml);

        if (items.length <= 5) {
            this.element("all").hide();
        }else{
            this.element("all").show();
        }

        if (this.get("border")) {
            // this.element().removeClass("topi-checkbox-list");
            this.element().addClass("--border");
        }else{
            this.element().removeClass("--border");
            // this.element().addClass("topi-checkbox-list");
        }

        this._reloadValue();
        this._reloadSearch();
        this._reloadState();
        this._reloadAll();

        return this;
    }

    _reloadValue() {
        const p = this.private(cn),
            multiple = this.get("multiple"),
            value = this.get("value"),
            keyValue = this.get("keyValue")
        ;

        if (this.get("multiple")) {
            this.element("items").find(".__checkbox").each((i, element) => {
                this.$(element).prop("checked", 0);
            });

            if (value.length > 0) {
                this.element("items").find(".__checkbox").each((i, element) => {
                    element = this.$(element);

                    if (value.find(item => item[keyValue] == element.data("id")) != undefined) {
                        element.prop("checked", 1);
                    }
                });
            }
        }else{
            this.element("items").find(".__checkbox").each((i, element) => {
                this.$(element).prop("checked", 0);
            });

            if (value != null) {
                this.element("items").find(".__checkbox").each((i, element) => {
                    element = this.$(element);

                    if (element.data("id") == value[keyValue]) {
                        element.prop("checked", 1);
                    }
                });
            }
        }
    }

    _reloadSearch() {
        let p = this.private(cn);
    }

    _reloadAll() {
        const p = this.private(cn),
            all = this.get("all")
        ;

        let counter = 0;

        if (all) {
            this.element("items").find(".__item").each((i, target) => {
                this.$(target).show();
            });

            this.element("all").html("- Pokaż mniej");
        }else{
            this.element("items").find(".__item").each((i, target) => {
                counter++;

                if (counter > 5) {
                    this.$(target).hide();
                }else{
                    this.$(target).show();
                }
            });

            this.element("all").html("+ Pokaż więcej");
        }
    }

    _reloadState() {
        let p = this.private(cn),
            state = this.get("&state")
        ;

        this.element().removeClass("--error");

        switch (state.type) {
            case "error":
                this.element().addClass("--error");
        }
    }
}

export default CheckboxList;
