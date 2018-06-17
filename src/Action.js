import TopiObject from 'Topi/Object';

/**
 * Podstawowa akcja.
 */
const cn = 'Action';
class Action extends TopiObject {
    async run(params, controller) {
        return Promise.resolve();
    }

    async end() {
        return Promise.resolve();
    }
}

export default Action;
