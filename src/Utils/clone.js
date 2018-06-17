/**
 * Create clone of object.
 */
function clone(a, params = {}) {
    // params.data = params.data === undefined ? 1 : params.data;

    // Po analizie okazało się że robienie kopi obiektu za pomocą
    // JSON.stringify i JSON.parse wychodzi najwolnie. Implementacja z recznym
    // kopiowaniem wypada o wiele szybciej niż JSON.parse. W benchmarku jedynie
    // szybszym rozwiązaniem był loadash deep clone. Ale nie wiem co on
    // dokładie robi. Szybko wypadał też Object.assign, ale ten nie robi deep
    // clona. Dotego psóuje tablice

    let cloned,
        i
    ;

    if (a === null) {
        return a;
    }else if(a === undefined){
        return a;
    }else if(Array.isArray(a)){
        cloned = [];

        for (i in a) {
            cloned.push(clone(a[i], params));
        }
    }else{
        switch (typeof a) {
            case 'string':
            case 'number':
            case 'function':
            case 'symbol':
                return a;
            case 'object':
                cloned = {};

                for (i in a) {
                    cloned[i] = clone(a[i], params);
                }

                break;
            default :
                console.warn(`unknow type of object ${typeof a}`);
                return a;
        }
    }

    return cloned;
};

export default clone;
