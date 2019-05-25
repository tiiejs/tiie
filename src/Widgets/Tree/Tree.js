/** @module Tiie/Widgets/Tree */
import Widget from "Tiie/Widgets/Widget";
import UtilsTree from "Tiie/Utils/Tree";
import List from "Tiie/Utils/List";
import View from "Tiie/View";

import templateLayout from "./resources/layout.html";
import templateLayoutPartially from "./resources/layout.partially.html";
import style from "./resources/style.scss";

const cn = "Tree";

/**
 * Widget to display tree.
 *
 * @class
 */
class Tree extends Widget {

    /**
     * Init tree widget.
     *
     * @param {object} data
     * @param {array} data[items]
     * @param {string} data[rootId]
     * @param {string} data[keyId]
     * @param {string} data[keyParent]
     * @param {string} data[keyLabel]
     * @param {string} data[expanded]
     * @param {string} data[value]
     * @param {array} data[sort]
     */
    constructor(data = {}) {
        super(templateLayout);

        let p = this.__private(cn, {
            layoutPartially : null,
        });

        this.__define("data.structure", {
            items : {type : "array", default : [], notNull : 1},
            keyId : {type : "string", default : "id", notNull : 1},
            keyParent : {type : "string", default : "parentId", notNull : 1},
            keyLabel : {type : "string", default : "name", notNull : 1},
            keyIcon : {type : "string", default : "icon", notNull : 1},
            expanded : {type : "array", default : [], notNull : 1},
            value : {type : "string", default : null, notNull : 0},
            sort : {type : "array", default : [], notNull : 1},
            mode : {type : "string", default : Tree.MODE_FULL, notNull : 0},
            rootId : {type : "string", default : null, notNull : 0},
        });

        this.set(data, {silently : 1, defined : 1});

        this.element("tree").on("click", ".tiie-widgets-tree__item-title", (event) => {
            let itemId = this.$(event.currentTarget).parent().data("id");

            if(itemId == "root") {
                this.set("value", null);
            } else {
                this.set("value", itemId);
            }

            event.stopPropagation();
            event.preventDefault();
        });

        this.element("tree").on("click", ".tiie-widgets-tree__item-expander", (event) => {
            let itemId = this.$(event.currentTarget).parent().data("id");

            let expanded = this.get("expanded");

            if (expanded.some(v => v == itemId)) {
                expanded = expanded.filter(v => v != itemId);
            } else {
                expanded.push(itemId);
            }

            this.set("expanded", expanded);

            event.stopPropagation();
            event.preventDefault();
        });

        // Wpinam się na zmiane wartosci
        this.on([
            "items",
            "value",
            "rootId",
            "keyId",
            "keyParent",
            "keyLabel",
            "expanded",
        ], () => {
            this.reload();
        }, this.id());
    }

    render() {
        if (this.get("mode") == Tree.MODE_FULL) {
            return this._renderFull();
        } else if (this.get("mode") == Tree.MODE_PARTIAL) {
            return this._renderPartial();
        }
    }

    _renderFull() {
        let p = this.__private(cn),
            value = this.get("value"),
            keyParent = this.get("keyParent"),
            keyId = this.get("keyId"),
            expanded = this.get("expanded"),
            html = ``
        ;

        let list = new List(this.get("&items"));

        list.sort(this.get("&sort"));

        let tree = new UtilsTree(list.toArray());

        tree.roots(this.get("rootId")).forEach((item) => {
            html += this._renderItem(tree, item, expanded);
        });

        this.element("tree").html(html);

        return this;
    }

    _renderPartial() {
        let p = this.__private(cn),
            value = this.get("value"),
            keyParent = this.get("keyParent"),
            keyId = this.get("keyId"),
            keyLabel = this.get("keyLabel"),
            keyIcon = this.get("keyIcon"),
            icons = this.__component("@icons"),
            items = this.get("items"),
            rootId = this.get("rootId"),
            htmlParents = ``,
            htmlChilds = ``
        ;

        let root = items.find(item => item[keyId] == rootId);

        if(root === undefined) {
            this.__log("I can't find root note.", "error", "Tiie.Widgets.Tree");

            return this;
        }

        // Attach layout partially if not exists.
        if(p.layoutPartially === null) {
            p.layoutPartially = new View(templateLayoutPartially);
            p.layoutPartially.target(this.element("tree"));
        }

        // Sort items.
        let list = new List(this.get("items"));

        list.sort(this.get("sort"));

        items = list.toArray();

        if (value != null && value != root[keyId]) {
            // Prepare rest of elements.
            let element = items.find(item => item[keyId] == value);

            if(element === undefined) {
                this.__log(`I can not find node ${value}.`, "error", "Tiie.Widgets.Tree");

                return this;
            }

            let childs = items.filter(item => item[keyParent] == element[keyId]);

            if(childs.length == 0) {
                element = items.find(item => item[keyId] == element[keyParent]);

                if(element === undefined) {
                    this.__log(`I can not find node ${element[keyParent]}.`, "error", "Tiie.Widgets.Tree");

                    return this;
                }

                childs = items.filter(item => item[keyParent] == element[keyId])
            }

            let tree = new UtilsTree(items, {
                keyId,
                keyParent,
                rootId,
            });

            let path = tree.path(element[keyId]);

            path.forEach((item) => {
                htmlParents += `
                    <div class="tiie-widgets-tree__item${item[keyId] == value ? ` --active` : ``}" data-id="${item[keyId]}">
                        ${item[keyIcon] ? `
                            <div class="tiie-widgets-tree__item-icon">
                                ${icons.get(item[keyIcon])}
                            </div>
                        ` : `<div class="tiie-widgets-tree__item-icon-blank"></div>`}
                        <div class="tiie-widgets-tree__item-title">
                            ${item[keyLabel]}
                        </div>
                    </div>
                `;
            });

            childs.forEach((item) => {
                htmlChilds += `
                    <div class="tiie-widgets-tree__item${item[keyId] == value ? ` --active` : ``}" data-id="${item[keyId]}">
                        ${item[keyIcon] ? `
                            <div class="tiie-widgets-tree__item-icon">
                                ${icons.get(item[keyIcon])}
                            </div>
                        ` : `<div class="tiie-widgets-tree__item-icon-blank"></div>`}
                        <div class="tiie-widgets-tree__item-title">
                            ${item[keyLabel]}
                        </div>
                    </div>
                `;
            });

            p.layoutPartially.element("parents").html(htmlParents);
            p.layoutPartially.element("parents").show();

            p.layoutPartially.element("childs").html(htmlChilds);
        } else {
            items.filter(item => item[keyParent] == root[keyId]).forEach((item) => {
                htmlChilds += `
                    <div class="tiie-widgets-tree__item${item[keyId] == value ? ` --active` : ``}" data-id="${item[keyId]}">
                        ${item[keyIcon] ? `
                            <div class="tiie-widgets-tree__item-icon">
                                ${icons.get(item[keyIcon])}
                            </div>
                        ` : `<div class="tiie-widgets-tree__item-icon-blank"></div>`}
                        <div class="tiie-widgets-tree__item" data-id="${item[keyId]}">
                            <div class="tiie-widgets-tree__item-title">
                                ${item[keyLabel]}
                            </div>
                        </div>
                    </div>
                `;
            });

            p.layoutPartially.element("parents").hide();
            // p.layoutPartially.element("childs").html(htmlChilds);
            p.layoutPartially.element("childs").html(htmlChilds);
        }

        return this;
    }

    // __setValue(target, name, value, emitparams = {}) {
    //     let p = this.__private(cn),
    //         keyId = this.get("keyId")
    //     ;

    //     if (name == "value") {
    //         let tree = new UtilsTree(this.get("&items")),
    //             expanded = this.get("expanded")
    //         ;

    //         tree.path(value).forEach((item) => {
    //             if (!expanded.some(v => v == item[keyId])) {
    //                 expanded.push(item[keyId]);
    //             }
    //         });

    //         this.set("expanded", expanded, {ommit : this.id()});

    //         return super.__setValue(target, name, value, emitparams);
    //     } else {
    //         return super.__setValue(target, name, value, emitparams);
    //     }
    // }

    _renderItem(tree, item, expanded) {
        let p = this._private,
            items = this.get("&items"),
            keyParent = this.get("keyParent"),
            keyId = this.get("keyId"),
            keyLabel = this.get("keyLabel"),
            htmlChilds = "",
            active = this.get("value") == item[keyId],
            hasChilds = items.some(child => child[keyParent] == item[keyId]) ? 1 : 0
        ;

        let isexpanded = expanded.some(v => v == item[keyId]) ? 1 : 0;

        if (isexpanded) {
            items.filter((e) => e[keyParent] == item.id).forEach((child) => {
                htmlChilds += this._renderItem(tree, child, expanded);
            });
        }

        let html = `
            <div class="tiie-widgets-tree__item" data-id="${item[keyId]}">
                <div class="tiie-widgets-tree__item-expander">
                    ${hasChilds ? isexpanded ? "-" : "+" : `<span class="tiie-widgets-tree__item-space"></span>`}
                </div>
                ${item.icon ? `
                <div class="tiie-widgets-tree__item-icon">
                    <i class="${item.icon}"></i>
                </div>
                ` : ``}
                <div class="tiie-widgets-tree__item-title ${active ? `--active` : ``}">
                    ${item[keyLabel]}
                </div>
            </div>
            ${htmlChilds ? `
            <div class="tiie-widgets-tree__item-childs">
                ${htmlChilds}
            </div>`
            : ``}
        `;

        return html;
    }

    // _isExpanded(itemId) {
    //     let p = this._private,
    //         expanded = this.get("&expanded")
    //     ;

    //     return expanded.find(v => v == itemId) ? 1 : 0;
    // }
}

Tree.MODE_FULL = "full";
Tree.MODE_PARTIAL = "partial";

export default Tree;
