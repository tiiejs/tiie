export default function(object, what) {

    switch (what) {
        case 'array':
            return Array.isArray(object);
        case 'object':
            return typeof object == 'object';
        case 'function':
            return typeof object == 'function';
        case 'number':
            return typeof object == 'number';
        case 'string':
            return typeof object == 'string';
    }

    throw(`unknow what ${what}`);
}
