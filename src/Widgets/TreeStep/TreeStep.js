import Widget from "Tiie/Widgets/Widget";
import UtilsTree from "Tiie/Utils/Tree";
import UtilsArray from "Tiie/Utils/Array";

import templateLayout from "./resources/layout.html";
import style from "./resources/style.scss";

const cn = "TreeStep";

class TreeStep extends Widget {
    constructor(data = {}) {
        super(templateLayout);

        let p = this.__private(cn, {});

        this.__define("data.structure", {
            keyId : {type : "string", default : "id", notNull : 1},
            keyName : {type : "string", default : "name", notNull : 1},
            keyParentId : {type : "string", default : "parentId", notNull : 1},
            keyIcon : {type : "string", default : "icon", notNull : 1},

            keySortGroupId : {type : "string", default : "groupId", notNull : 1},
            keySortGroupName : {type : "string", default : "group", notNull : 1},
            sortOut : [],

            items : {tyoe : "array", default : [], notNull : 1},
            search : {type : "string", default : null, notNull : 0},
            value : {type : "string", default : null, notNull : 0},
            expanded : {type : "string", default : null, notNull : 0},
            dashboard : {type : "boolean", default : 1, notNull : 1},
        });

        this.set(data, {silently : 1, defined : 1});

        if(data.root) {
            this.set("-root", data.root);
        } else {
            let root = {};

            Object.defineProperty(root, this.get("keyId"), {
                value: null,
                enumerable : true,
            });

            Object.defineProperty(root, this.get("keyName"), {
                value: "Home",
                enumerable : true,
            });

            Object.defineProperty(root, this.get("keyIcon"), {
                value: null,
                enumerable : true,
            });

            this.set("-root", root);
        }

        this.element("searchInput").on("keyup", (event) => {
            let target = this.$(event.currentTarget);

            if(target.val() == "") {
                this.set("search", null);
            } else {
                this.set("search", target.val());
            }
        });

        this.element().on("click", ".tiie-w-tree__item", (event) => {
            let target = this.$(event.currentTarget),
                keyParentId = this.get("&keyParentId"),
                id = target.data("id")
            ;

            if(this.get("search")) {
                this.set("search", null);
            }

            if(this.get("&items").some(item => item[keyParentId] == id)) {
                this.set("expanded", id);
                this.set("value", null);
            } else {
                this.set("value", id);
            }

            event.stopPropagation();
        });

        this.on([
            "keyId:change",
            "keyName:change",
            "keyParentId:change",
            "keyIcon:change",
            "items:change",
            "search:change",
            "value:change",
            "expanded:change",
            "root:change",
        ], (event) => {
            this.reload();
        }, this.id());
    }

    render() {
        let p = this.__private(cn),
            value = this.get("&value"),
            expanded = this.get("&expanded"),
            items = this.get("items"),
            keyId = this.get("&keyId"),
            keyIcon = this.get("&keyIcon"),
            keyParentId = this.get("&keyParentId"),
            keyName = this.get("&keyName"),
            search = this.get("&search"),
            root = this.get("&root"),
            sortOut = this.get("&sortOut")
        ;

        // Push abstract root.
        items.push(root);

        let tree = new UtilsTree(items);

        if(search) {
            this._renderSearch();
        } else {
            // Clean search input.
            this.element("searchInput").val("");

            if(value) {
                value = items.find(item => item[keyId] == value);

                if(expanded == null) {
                    expanded = value[keyParentId];
                }
            } else {
                if(expanded == null) {
                    expanded = root[keyId];
                }
            }

            if(this.is("dashboard") && expanded == root[keyId]) {
                // Display dashboard.
                let childs = items.filter(item => item[keyParentId] == root[keyId]);

                let html = childs.map((item) => {
                    return `
                        <div class="tiie-w-tree__dashboard-item tiie-w-tree__item tiie-link" data-id="${item[keyId]}">
                            <div class="tiie-w-tree__dashboard-item-icon">
                                <i class="${item.icon}"></i>
                            </div>
                            <div class="tiie-w-tree__dashboard-item-title">
                                ${item[keyName]}
                            </div>
                        </div>
                    `;
                }).join("");

                this.element("dashboard").html(html);
                this.element("search").html("");
                this.element("items").html("");
            } else {
                let childs = items.filter(item => item[keyParentId] == expanded),
                    path = tree.path(expanded).reverse(),
                    htmlPath = '',
                    htmlChilds = ''
                ;

                path.unshift(root);

                if(sortOut.length > 0) {
                    // Sort childs.
                    childs.sort((a, b) => {
                        if(sortOut.indexOf(b[keyName]) >= 0) {
                            return -1;
                        }

                        return a[keyName] > b[keyName] ? 1 : -1;
                    });
                } else {
                    // Sort childs.
                    childs.sort((a, b) => {
                        return a[keyName] > b[keyName] ? 1 : -1;
                    });
                }

                path.forEach((item, key) => {
                    if(key > 0) {
                        htmlPath += `<span class="tiie--space-horizontally-5">-</span>`;
                    }

                    if(item[keyIcon]) {
                        htmlPath += `<i class="${item[keyIcon]} tiie--space-right-5"></i>`;
                    }

                    htmlPath += `<span class="tiie-w-tree__item tiie-link" data-id="${item.id}">${item[keyName]}</span>`;
                });

                let splited = (new UtilsArray).splitToRows(childs, 2);

                splited.forEach((childs) => {
                    let htmlCols = childs.map((item) => {
                        return `
                            <div class="tiie-w-tree__item tiie-link col" data-id="${item[keyId]}">
                                ${item[keyName]}
                            </div>
                        `;
                    }).join("");

                    htmlChilds += `<div class="row no-gutters">${htmlCols}</div>`;
                });


                let html = `
                    <div class="tiie-w-tree__child-path tiie--space-vertical-5">
                        ${htmlPath}
                    </div>
                    <div class="row">
                        <div class="col">
                            ${htmlChilds}
                        </div>
                    </div>
                `;

                this.element("dashboard").html("");
                this.element("search").html("");
                this.element("items").html(html);
            }
        }
    }

    _renderSearch() {
        let p = this.__private(cn),
            items = this.get("&items"),
            keyId = this.get("&keyId"),
            keyIcon = this.get("&keyIcon"),
            keyName = this.get("&keyName"),
            search = this.get("&search"),
            tree = new UtilsTree(items)
        ;

        let filtered = items.filter(item => item[keyName].indexOf(search) >= 0 ? 1 : 0);

        let html = filtered.map((item) => {
            let path = tree.path(item[keyId]).reverse();

            return `
                <div class="tiie-w-tree__search-item">
                    <div class="tiie-w-tree__search-item-title tiie-w-tree__item tiie-link" data-id="${item[keyId]}">
                        ${item[keyName]}
                    </div>
                    <div class="tiie-w-tree__search-item-path">
                        ${path.map((item, key) => {
                            let html = "";

                            if(key > 0) {
                                html += `<span class="tiie--space-horizontally-5">-</span>`;
                            }

                            if(item[keyIcon]) {
                                html += `<i class="${item[keyIcon]} tiie--space-right-5"></i>`;
                            }

                            html += `<span class="tiie-w-tree__item tiie-link" data-id="${item.id}">${item[keyName]}</span>`;

                            return html;
                        }).join("")}
                    </div>
                </div>
            `;
        }).join("");

        this.element("dashboard").html("");
        this.element("search").html(html);
        this.element("items").html("");
    }
}

export default TreeStep;
