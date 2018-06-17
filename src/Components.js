import TopiObject from 'Topi/Object';

const cn = 'Components';
class Components extends TopiObject {
    constructor(components = {}) {
        super();

        let p = this.private(cn, {
            components,
            inited : {}
        });
    }

    get(name, params = {}) {
        let p = this.private(cn);

        if (name[0] == '@') {
            if (p.inited[name] === undefined) {
                if (p.components[name] === undefined) {
                    throw(`Component ${name} is not defined.`);
                }

                p.inited[name] = p.components[name](this, params);
            }

            return p.inited[name];
        }else{
            if (p.components[name] === undefined) {
                throw(`Component ${name} is not defined.`);
            }

            return p.components[name](this, params);
        }
    }

    set(name, service) {
        let p = this.private(cn);

        p.inited[name] = service;

        return this;
    }
}

export default Components;
