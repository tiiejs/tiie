import TopiObject from 'Topi/Object';

import clone from 'Topi/Utils/clone';

// merge({
//     name :
//
// }, {}, {cope : 0, data : 0});

// merge({}, {});
// merge([1, 2, 3], [4, 5, 6]);
// merge([1, 2, 3], [4, 5, {}], {copy : 1, data : 1});
function merge(a, b, params = {}) {
    // console.warn('merge', a, b);
    let merged,
        i
    ;

    params.data == params.data === undefined ? 1 : params.data;
    params.clone == params.clone === undefined ? 1 : params.clone;
    params.deep == params.deep === undefined ? 0 : params.deep;

    if (Array.isArray(a) && Array.isArray(b)) {
        merged = [].concat(a).concat(b);

        if (params.clone) {
            return clone(merged, params);
        }else{
            return merged;
        }
    }else{
        merged = {};

        for (i in a) {
            merged[i] = a[i];
        }

        for (i in b) {
            if (merged[i] === undefined) {
                merged[i] = b[i];
            }else{
                if (params.deep) {
                    if(merged[i] === null){
                        merged[i] = b[i];
                    }else if(Array.isArray(merged[i])){
                        if (Array.isArray(b[i])) {
                            merged[i] = merge(merged[i], b[i], params);
                        }else{
                            merged[i] = b[i];
                        }
                    }else{
                        switch (typeof merged[i]) {
                            case 'string':
                            case 'number':
                            case 'function':
                            case 'symbol':
                                merged[i] = b[i];
                                break;
                            case 'object':
                                merged[i] = merge(merged[i], b[i], params);

                                break;
                            default :
                                merged[i] = b[i];
                                console.warn(`unknow type of object ${typeof merged[i]}`);
                        }
                    }
                }else{
                    merged[i] = b[i];
                }
            }
        }

        if (params.clone) {
            return clone(merged, params);
        }else{
            return merged;
        }

        // return merged;
    }
}

export default merge;
