import TopiObject from 'Topi/Object';
import LoaderView from 'Topi/Views/Components/Loader/Loader';
import LoaderHandler from 'Topi/Views/Components/Loader/Handler';

const cn = 'Manager';

/**
 * Manager to control loader view.
 */
class Manager extends TopiObject {
    constructor(target, params = {}) {
        super();

        const p = this.private(cn);

        p.target = target;
        // p.params = params;
    }

    show(target = null, params = {}) {
        const p = this.private(cn);

        let loaderView = new LoaderView();
        let loaderHandler = new LoaderHandler(loaderView, this, params);

        p.target.css('position', 'relative');

        loaderView
            .target(p.target)
            .render()
        ;

        return loaderHandler;
    }
}

export default Manager;
