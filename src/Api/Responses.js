import TopiObject from 'Topi/Object';

const cn = 'Responses';
class Responses extends TopiObject {
    constructor(responses){
        super();

        let p = this.__private(cn, {
            responses,
        });
    }

    getByName(name) {
        return this.get(name);
    }

    get(name) {
        return this.__private(cn, 'responses').find((response) => {
            return response.name() == name;
        });
    }

    error() {
        return undefined != this.__private(cn, 'responses').find((response) => {
            return response.error();
        });
    }

}

export default Responses;
