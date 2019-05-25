import Widget from "Tiie/Widgets/Widget";
import UtilsTree from "Tiie/Utils/Tree";
import UtilsArray from "Tiie/Utils/Array";
import List from "Tiie/Utils/List";

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
            keyParent : {type : "string", default : "parentId", notNull : 1},
            keyIcon : {type : "string", default : "icon", notNull : 1},

            keySortGroupId : {type : "string", default : "groupId", notNull : 1},
            keySortGroupName : {type : "string", default : "group", notNull : 1},
            sort : {type : "array", default : [], notNull : 1},

            rootId : {type : "string", default : null, notNull : 0},

            items : {tyoe : "array", default : [], notNull : 1},
            search : {type : "string", default : null, notNull : 0},
            value : {type : "string", default : null, notNull : 0},
            expanded : {type : "string", default : null, notNull : 0},
            dashboard : {type : "boolean", default : 1, notNull : 1},
        });

        this.set(data, {silently : 1, defined : 1});

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
                keyParent = this.get("&keyParent"),
                id = target.data("id")
            ;

            if(this.get("search")) {
                this.set("search", null);
            }

            if(this.get("&items").some(item => item[keyParent] == id)) {
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
            "keyParent:change",
            "keyIcon:change",

            "items:change",
            "search:change",
            "value:change",
            "expanded:change",
            "rootId:change",
        ], (event) => {
            this.reload();
        }, this.id());
    }

    render() {
        let p = this.__private(cn),
            value = this.get("value"),
            expanded = this.get("expanded"),
            items = this.get("items"),
            keyId = this.get("keyId"),
            keyIcon = this.get("keyIcon"),
            keyParent = this.get("keyParent"),
            keyName = this.get("keyName"),
            search = this.get("search"),
            rootId = this.get("rootId"),
            sort = this.get("sort")
        ;

        let tree = new UtilsTree(items, {
            keyId,
            keyParent,
            rootId,
        });

        if(search) {
            this._renderSearch();
        } else {
            // Clean search input.
            this.element("searchInput").val("");

            if(value) {
                value = items.find(item => item[keyId] == value);

                if(expanded == null) {
                    expanded = value[keyParent];
                }
            } else {
                if(expanded == null) {
                    expanded = rootId;
                }
            }

            if(this.is("dashboard") && expanded == rootId) {
                // Display dashboard.
                let childs = items.filter(item => item[keyParent] == rootId);

                // Sort elements
                let list = new List(childs);

                list.sort(this.get("&sort"));

                childs = list.toArray();

                let html = childs.map((item) => {
                    return `
                        <div class="col-12 col-sm-3">
                            <div class="tiie-w-tree__dashboard-item tiie-w-tree__item tiie-link" data-id="${item[keyId]}">
                                <div class="tiie-w-tree__dashboard-item-icon">
                                    <i class="${item.icon}"></i>
                                </div>
                                <div class="tiie-w-tree__dashboard-item-title">
                                    ${item[keyName]}
                                </div>
                            </div>
                        </div>
                    `;
                }).join("");

                this.element("dashboard").html(html);
                this.element("search").html("");
                this.element("items").html("");
            } else {
                let childs = items.filter(item => item[keyParent] == expanded),
                    path = tree.path(expanded).reverse(),
                    htmlPath = '',
                    htmlChilds = ''
                ;

                // Sort elements
                let list = new List(childs);

                list.sort(this.get("&sort"));

                childs = list.toArray();

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
            keyParent = this.get("keyParent"),
            rootId = this.get("rootId"),
            search = this.get("&search"),
            tree = new UtilsTree(items, {
                keyId,
                keyParent,
                rootId,
            })
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
