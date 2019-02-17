/**
 * Create clone of object.
 */
function clone(a, params = {}) {
    // Po analizie okazało się że robienie kopi obiektu za pomocą
    // JSON.stringify i JSON.parse wychodzi najwolnie. Implementacja z recznym
    // kopiowaniem wypada o wiele szybciej niż JSON.parse. W benchmarku jedynie
    // szybszym rozwiązaniem był loadash deep clone. Ale nie wiem co on
    // dokładie robi. Szybko wypadał też Object.assign, ale ten nie robi deep
    // clona. Dotego psóuje tablice

    if (a === null) {
        return a;
    }else if(a === undefined){
        return a;
    }else if(Array.isArray(a)){
        let cloned = [];

        for (let i in a) {
            cloned.push(clone(a[i], params));
        }

        return cloned;
    }else{
        let type = typeof(a);

        if(
            type == "string" ||
            type == "number" ||
            type == "function" ||
            type == "symbol"
        ) {
            return a;
        } else if(type == "object" && a.constructor == Object) {
            let cloned = {};

            for (let i in a) {
                cloned[i] = clone(a[i], params);
            }

            return cloned;
        } else {
            return a;
        }
    }
};

export default clone;
