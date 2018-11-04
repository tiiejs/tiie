import TopiObject from 'Topi/Object';

const cn = 'Tree';

class Tree extends TopiObject {
    constructor(data = [], params = {}) {
        super();

        const p = this.__private(cn, {
            data,
            keyValue : params.keyValue == undefined ? 'id' : params.keyValue,
            keyParent : params.keyParent == undefined ? 'parentId' : params.keyParent,
        });
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
        stack = stack.concat(p.data.filter(e => e[p.keyParent] == from));

        while(stack.length > 0) {
            pointer = stack.pop();

            // if (pointer.id == 3347) {
            //     debugger;
            // }

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

                let elements = p.data.filter(e => e[p.keyParent] == pointer[p.keyValue]);

                if (elements.length > 0) {
                    level++;
                    stack.push(level);
                    stack = stack.concat(elements);
                }
            }
        }

        return childs;
    }

    path(from) {
        const p = this.__private(cn);

        let pointer = this.findById(from);

        if (pointer == null) {
            return [];
        }

        let path = [pointer];

        while(pointer[p.keyParent] != null) {
            pointer = p.data.find(e => e[p.keyValue] == pointer[p.keyParent]);

            if (pointer == undefined) {
                return path;
            }

            path.push(pointer);
        }

        return path;
    }

    findAtPath(from, params) {
        const p = this.__private(cn);
    }

    findById(id) {
        const p = this.__private(cn);

        let found = p.data.find(e => e[p.keyValue] == id);

        return found == undefined ? null : found;
    }

    roots() {
        const p = this.__private(cn);

        return p.data.filter(e => e[p.keyParent] == null);
    }

    firstRoot() {
        const p = this.__private(cn);

        let roots = this.roots();

        console.log('roots', roots);
        if (roots.length > 0) {
            return roots[0];
        } else {
            return null;
        }
    }
}

export default Tree;
