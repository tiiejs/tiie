import TopiObject from 'Topi/Object';

const cn = 'Controller';
class Controller extends TopiObject {
    constructor(target) {
        super();

        let p = this.private(cn, {
            target,
        });
    }

    /**
     * Return target for controller.
     *
     * @return {jQuery}
     */
    target() {
        let p = this.private(cn);

        return p.target;
    }

    /**
     * Return container of controller. It can be main container or other if
     * controller supports the
     *
     * @param {string} name
     * @return {jQuery}
     */
    element(name) {}

    /**
     * Run specific action at controller. Way of run action is dependend from
     * controller.
     *
     * @param {Action} Class for action to run.
     */
    async action(action, params = {}) {}

    /**
     * Run controller. This method should prepare layout and other things
     * action.
     *
     * @return {Promise}
     */
    async run() {
        return Promise.resolve();
    }

    /**
     * Stop controller. This method should clean all things from App.
     *
     * @return {Promise}
     */
    async end() {
        return Promise.resolve();
    }
}

export default Controller;
