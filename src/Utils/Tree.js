import TiieObject from 'Tiie/Object';

const cn = 'Tree';

class Tree extends TiieObject {
    constructor(items = [], params = {}) {
        super();

        const p = this.__private(cn, {
            items,
            keyId : params.keyId == undefined ? 'id' : params.keyId,
            keyParent : params.keyParent == undefined ? 'parentId' : params.keyParent,
            rootId : params.rootId == undefined ? null : params.rootId,
        });

        if(!p.items.some(item => item[p.keyId] == p.rootId)) {
            throw `I can't find node ${p.rootId}`;
        }
    }

    childs(from, params = {}) {
        const p = this.__private(cn);

        let keyParent = p.keyParent,
            childs = [],
            pointer,
            stack = [],
            level = 0
        ;

        // debugger;
        stack = [level];
        stack = stack.concat(p.items.filter(e => e[p.keyParent] == from));

        while(stack.length > 0) {
            pointer = stack.pop();

            if (params.deep != undefined) {
                if (level > params.deep) {
                    continue;
                }
            }

            if (typeof pointer == 'number') {
                level = pointer - 1;

                continue;
            } else {
                childs.push(pointer);

                let elements = p.items.filter(e => e[p.keyParent] == pointer[p.keyId]);

                if (elements.length > 0) {
                    level++;
                    stack.push(level);
                    stack = stack.concat(elements);
                }
            }
        }

        return childs;
    }

    path(to) {
        let p = this.__private(cn),
            pointer = this.findById(to)
        ;

        if (pointer == null) {
            return null;
        }

        let path = [pointer];

        while(pointer[p.keyId] != p.rootId) {
            pointer = p.items.find(e => e[p.keyId] == pointer[p.keyParent]);

            if (pointer == undefined) {
                return path;
            }

            path.push(pointer);
        }

        // Reverse path
        path.reverse();

        return path;
    }

    findAtPath(from, params) {
        const p = this.__private(cn);
    }

    find(params = {}) { }

    findById(id) {
        const p = this.__private(cn);

        let found = p.items.find(e => e[p.keyId] == id);

        return found == undefined ? null : found;
    }

    roots(value = null) {
        const p = this.__private(cn);

        return p.items.filter(e => e[p.keyParent] == value);
    }

    firstRoot() {
        const p = this.__private(cn);

        let roots = this.roots();

        if (roots.length > 0) {
            return roots[0];
        } else {
            return null;
        }
    }
}

export default Tree;
