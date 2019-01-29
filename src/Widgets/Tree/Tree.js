import Widget from 'Tiie/Widgets/Widget';
import UtilsTree from "Tiie/Utils/Tree";

import templateLayout from './resources/layout.html';
import style from './resources/style.scss';

const cn = 'Tree';

class Tree extends Widget {
    constructor(state = {}) {
        super(templateLayout);

        let p = this.__private(cn);

        this.set('-items', state.items === undefined ?  [] : state.items);
        this.set('-rootId', state.rootId === undefined ? null : state.rootId);
        this.set('-keyValue', state.keyValue === undefined ? 'id' : state.keyValue);
        this.set('-keyParent', state.keyParent === undefined ? 'parentId' : state.keyParent);
        this.set('-keyLabel', state.keyLabel === undefined ? 'name' : state.keyLabel);
        this.set('-expanded', state.expanded === undefined ? [] : state.expanded);
        this.set('-value', state.value === undefined ? null : state.value);

        this.element('tree').on('click', '.tiie-vw-tree__item-title', (event) => {
            let itemId = this.$(event.currentTarget).parent().data('id');

            this.set('value', itemId);

            event.stopPropagation();
            event.preventDefault();
        });

        this.element('tree').on('click', '.tiie-vw-tree__item-expander', (event) => {
            let itemId = this.$(event.currentTarget).parent().data('id');

            let expanded = this.get('expanded');

            if (expanded.some(v => v == itemId)) {
                expanded = expanded.filter(v => v != itemId);
            } else {
                expanded.push(itemId);
            }

            this.set('expanded', expanded);

            event.stopPropagation();
            event.preventDefault();
        });

        // Wpinam się na zmiane wartosci
        this.on([
            'items',
            'value',
            'rootId',
            'keyValue',
            'keyParent',
            'keyLabel',
            'expanded',
        ], () => {
            this.reload();
        }, this.id());
    }

    render() {
        let p = this.__private(cn),
            tree = new UtilsTree(this.get('&items')),
            value = this.get('value'),
            keyParent = this.get('keyParent'),
            keyValue = this.get('keyValue'),
            expanded = this.get('expanded'),
            html = ``
        ;

        tree.roots(this.get('rootId')).forEach((item) => {
            html += this._renderItem(tree, item, expanded);
        });

        this.element('tree').html(html);

        return this;
    }

    __setValue(target, name, value, emitparams = {}) {
        let p = this.__private(cn),
            keyValue = this.get('keyValue'),
            expanded = this.get('expanded'),
            tree = new UtilsTree(this.get('&items'))
        ;

        if (name == 'value') {
            // Expand needed items to display value.
            tree.path(value).forEach((item) => {
                if (!expanded.some(v => v == item[keyValue])) {
                    expanded.push(item[keyValue]);
                }
            });

            this.set('expanded', expanded, {ommit : this.id()});

            return super.__setValue(target, name, value, emitparams);
        } else {
            return super.__setValue(target, name, value, emitparams);
        }
    }

    _renderItem(tree, item, expanded) {
        let p = this._private,
            items = this.get("&items"),
            keyParent = this.get('keyParent'),
            keyValue = this.get('keyValue'),
            keyLabel = this.get('keyLabel'),
            htmlChilds = '',
            active = this.get('value') == item[keyValue],
            hasChilds = items.some(child => child[keyParent] == item[keyValue]) ? 1 : 0
        ;

        let isexpanded = expanded.some(v => v == item[keyValue]) ? 1 : 0;

        if (isexpanded) {
            items.filter((e) => e[keyParent] == item.id).forEach((child) => {
                htmlChilds += this._renderItem(tree, child, expanded);
            });
        }

        let html = `
            <div class="tiie-vw-tree__item" data-id='${item[keyValue]}'>
                <div class="tiie-vw-tree__item-expander">
                    ${hasChilds ? isexpanded ? '-' : '+' : '<span class="tiie-vw-tree__item-space"></span>'}
                </div>
                ${item.icon ? `
                <div class="tiie-vw-tree__item-icon">
                    <i class="${item.icon}"></i>
                </div>
                ` : ``}
                <div class="tiie-vw-tree__item-title ${active ? `--active` : ``}">
                    ${item[keyLabel]}
                </div>
            </div>
            ${htmlChilds ? `
            <div class='tiie-vw-tree__item-childs'>
                ${htmlChilds}
            </div>`
            : ``}
        `;

        // p.state.lastExpanded = null;

        return html;
    }

    _isExpanded(itemId) {
        let p = this._private,
            expanded = this.get('&expanded')
        ;

        return expanded.find(v => v == itemId) ? 1 : 0;
    }
}

export default Tree;
