import Widget from 'Tiie/Widgets/Widget';
import Tree from "Tiie/Utils/Tree";

import templateLayout from "./resources/layout.html";
import style from "./resources/style.scss";

const cn = "Select";

class Select extends Widget {
    constructor(data = {}, params = {}) {
        super(templateLayout);

        let p = this.__private(cn, {
            searchTimeout : null,

            animations : {
                hidden : null,
            },

            metadata : [],
        });

        this.__define("data.structure", {
            keyValue : {type : "string", default : "id", notNull : 1},
            keyName : {type : "string", default : "name", notNull : 1},
            keyParent : {type : "string", default : "parentId", notNull : 1},
            // keyLeaf : {type : "boolean", default : "leaft", notNull : 1},
            rootId : {type : "string", default : null, notNull : 0},
            items : {type : "array", default : [], notNull : 1},
            sort : {type : "array", default : [], notNull : 1},
            expanded : {type : "string", default : null, notNull : 0},
            multiple : {type : "boolean", default : 0, notNull : 1},
            placeholder : {type : "string", default : "...", notNull : 0},

            // Search
            search : {type : "string", default : null, notNull : 0},
            searchResult : {type : "array", default : [], notNull : 1},

            // Panel
            panelVisible : {type : "boolean", default : 0, notNull : 1},
        });

        this.set(data, {silently : 1, defined : 1});

        this.set("-value", data.value);

        this.on([
            "keyValue:change",
            "keyName:change",
            "keyParent:change",
            // "keyLeaf:change",
            "rootId:change",
            "items:change",
            "sort:change",
            "expanded:change",
            "search:change",
            "multiple:change",
            "panelVisible:change",
            "value:change",
        ], () => {
            this.reload();
        });

        this._initEvents();
    }

    _initEvents() {
        let p = this.__private(cn),
            rootId = this.get("rootId")
        ;

        this.element().on("click", ".tiie-widgets-select__value", (event) => {
            if(this.is("panelVisible")) {
                this.set("panelVisible", 0);
            } else {
                this.set("panelVisible", 1);
            }

            this.reload();

            event.stopPropagation();
        });

        this.element().on("click", ".tiie-widgets-select__item", (event) => {
            let id = this.$(event.currentTarget).data("id");

            this._selectItem(id);

            if (!this.is("multiple")) {
                this.set("panelVisible", 0);
            }

            event.stopPropagation();
        });

        this.element().on("click", ".tiie-widgets-search-result-item", (event) => {
            let id = this.$(event.currentTarget).data("id");

            this._selectItem(id);

            if (!this.is("multiple")) {
                this.set("panelVisible", 0);
            }

            event.stopPropagation();
        });

        this.element().on("click", ".tiie-widgets-select__selected-item-remove", (event) => {
            let target = this.$(event.currentTarget),
                id = target.data("id")
            ;

            if (this.is("multiple")) {
                let value = this.get("value");

                // Filter
                value = value.filter(v => v != id);

                target.parent().addClass("--hidden");

                setTimeout(() => {
                    this.set("value", value);
                }, 400);
            }

            event.stopPropagation();
        });

        this.element().on("click", ".tiie-widgets-select__parent", (event) => {
            let target = this.$(event.currentTarget),
                id = target.data("id")
            ;

            if (this.get("expanded") == id) {
                return;
            }

            this.set("expanded", id);

            event.stopPropagation();
        });

        this.element("search").on("keyup", (event) => {
            let target = this.$(event.currentTarget);

            if (p.searchTimeout) {
                // Clean present timeout.
                clearTimeout(p.searchTimeout);
            }

            if(target.val()) {
                this.set("search", target.val());
            } else {
                this.set("search", null);
            }
        });
    }

    _selectItem(id) {
        let p = this.__private(cn),
            promise = null,
            keyParent = this.get("keyParent")
        ;

        if(this.get("&items").some(item => item[keyParent] == id)) {
            this.set("expanded", id);
        } else {
            let value = this.get("value");

            if(this.is("multiple")) {
                if(!value.some(v => v == id)) {
                    value.push(id);

                    this.set("value", value);
                }
            } else {
                if(value == id) {
                    this.set("value", null);
                } else {
                    this.set("value", id);
                }
            }
        }
    }

    __setValue(target, name, value, emitparams = {}) {
        let p = this.__private(cn),
            items = this.get("&items"),
            keyValue = this.get("keyValue")
        ;

        if(name == "value") {
            if(value === null || value === undefined) {
                if(this.is("multiple")) {
                    value = [];
                }
            }

            return super.__setValue(target, name, value, emitparams);
        } else {
            return super.__setValue(target, name, value, emitparams);
        }
    }

    render() {
        super.render();

        let p = this.__private(cn);

        this._renderValue();

        if(this.is("panelVisible")) {
            this.element("panel").removeClass("--hidden");
        } else {
            this.element("panel").addClass("--hidden");

            return;
        }

        this._renderSelected();
        this._renderSearch();
        this._renderNodes();

        return this;
    }

    _renderSearch() {
        let p = this.__private(cn),
            keyValue = this.get("keyValue"),
            keyName = this.get("keyName"),
            search = this.get("search"),
            searchResult = this.get("&searchResult")
        ;

        if (!search) {
            // There is no searching, I hide object.
            this.element("searchResult").addClass("--hidden");

            return;
        }

        if (searchResult.length) {
            this.element("searchResult").html(searchResult.map((item) => {
                return `<div class="tiie-widgets-search-result-item tiie-pointer" data-id="${item[keyValue]}">${item[keyName]}</div>`;
            }).join(""));
        } else {
            this.element("searchResult").html("Brak wyników");
        }

        // Display element.
        this.element("searchResult").removeClass("--hidden");
    }

    _renderNodes() {
        let p = this.__private(cn),
            items = this.get("&items"),
            expanded = this.get("expanded"),
            keyValue = this.get("keyValue"),
            keyParent = this.get("keyParent"),
            keyName = this.get("keyName"),
            value = this.get("value"),
            multiple = this.get("multiple"),
            rootId = this.get("rootId"),
            search = this.get("search"),
            isParents = false
        ;

        if(search) {
            this.element("items").addClass("--hidden");
            this.element("parents").addClass("--hidden");

            return;
        }

        // If no is expaned then Root is expaned.
        if (expanded == null) {
            expanded = rootId;
        }

        let tree = new Tree(items, {
            keyValue,
            keyName,
            rootId,
        });

        if(expanded != rootId) {
            let path = tree.path(expanded);

            this.element("parents").html(path.map((item) => {
                return `<div class="tiie-widgets-select__parent tiie-pointer" data-id="${item[keyValue]}">${item[keyName]}</div>`;
            }).join(""));

            // Set flag to display parents.
            isParents = true;
        } else {
            // Set flag to hide parents.
            isParents = false;
        }

        let childs = items.filter((item) => item[keyParent] == expanded);

        this.element("items").html(childs.map((item) => {
            let selected = false;

            if(multiple) {
                selected = value.some(v => v == item[keyValue]);
            } else {
                selected = value == item[keyValue];
            }

            return `
                <div class="tiie-widgets-select__item tiie-pointer${selected ? ` --selected` : ``}" data-id="${item[keyValue]}">
                    ${item[keyName]}
                </div> `;
        }).join(""));

        // Show/Hide elements.
        this.element("items").removeClass("--hidden");

        if(isParents) {
            this.element("parents").removeClass("--hidden");
        } else {
            this.element("parents").addClass("--hidden");
        }
    }

    _renderValue() {
        let p = this.__private(cn),
            items = this.get("&items"),
            expanded = this.get("expanded"),
            keyValue = this.get("keyValue"),
            keyParent = this.get("keyParent"),
            keyName = this.get("keyName"),
            multiple = this.get("multiple"),
            placeholder = this.get("placeholder"),
            value = this.get("value"),
            rootId = this.get("rootId")
        ;

        // Value
        if (multiple) {
            let html = value.map((v) => {
                let item = items.find(i => i[keyValue] == v);

                return item[keyName];
            }).join(", ");

            if(html) {
                this.element("value").html(html);
            } else {
                if(placeholder) {
                    this.element("value").html(`<span class="tiie-widgets-select__value-placeholder">${placeholder}</span>`);
                } else {
                    this.element("value").html("");
                }
            }
        } else {
            if(value) {
                let item = items.find(i => i[keyValue] == value);

                this.element("value").html(item[keyName]);
            } else {
                if(placeholder) {
                    this.element("value").html(`<span class="tiie-widgets-select__value-placeholder">${placeholder}</span>`);
                } else {
                    this.element("value").html(item[keyName]);
                }
            }
        }
    }

    _renderSelected() {
        let p = this.__private(cn),
            items = this.get("&items"),
            expanded = this.get("expanded"),
            keyValue = this.get("keyValue"),
            keyParent = this.get("keyParent"),
            keyName = this.get("keyName"),
            multiple = this.get("multiple"),
            placeholder = this.get("placeholder"),
            value = this.get("value"),
            rootId = this.get("rootId")
        ;

        if(multiple) {
            let tree = new Tree(items, {
                keyValue,
                keyName,
                rootId,
            });

            let html = value.map((v) => {
                let item = items.find(i => i[keyValue] == v),
                    path = tree.path(item[keyValue])
                ;

                path.shift();
                path.pop();

                let htmlPath = "";

                if(path.length) {
                    htmlPath = path.map((item) => {
                        return item[keyName];
                    }).join(" - ");
                }

                return `
                    <div class="tiie-widgets-select__selected-item${p.animations.hidden == item[keyValue] ? ` --hidden` : ``}">
                        <div class="tiie-widgets-select__selected-item-title" data-id="${item[keyValue]}">
                            ${item[keyName]}
                        </div>
                        <div class="tiie-widgets-select__selected-item-left">
                            <div class="tiie-widgets-select__selected-item-path">
                                ${htmlPath}
                            </div>
                            <div class="tiie-widgets-select__selected-item-remove" data-id="${item[keyValue]}">
                                <i class="fas fa-trash"></i>
                            </div>
                        </div>
                    </div>
                `;
            }).join("");

            p.animations.hidden = null;

            if(html) {
                this.element("selected").html(html);
            } else {
                this.element("selected").html("");
            }
        } else {
            this.element("selected").html("");
        }
    }
}

export default Select;
