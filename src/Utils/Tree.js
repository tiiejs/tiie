import TopiObject from 'Topi/Object';

const cn = 'Tree';

class Tree extends TopiObject {
    constructor(data = [], params = {}) {
        super();

        const p = this.private(cn, {
            data,
            keyValue : params.keyValue == undefined ? 'id' : params.keyValue,
            keyParent : params.keyParent == undefined ? 'parentId' : params.keyParent,
        });
    }

    childs(from, params = {}) {
        const p = this.private(cn);

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

            if (params.deep != undefined) {
                if (level > params.deep) {
                    continue;
                }
            }

            if (typeof pointer == 'number') {
                level = pointer;

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
        const p = this.private(cn);

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
        const p = this.private(cn);
    }

    findById(id) {
        const p = this.private(cn);

        let found = p.data.find(e => e[p.keyValue] == id);

        return found == undefined ? null : found;
    }
}

export default Tree;
