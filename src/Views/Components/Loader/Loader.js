import TopiObject from 'Topi/Object';
import View from "Topi/View";

import templateLayout from "./Loader.layout.html";

const cn = 'Loader';

/**
 * Base view to display loader.
 */
class Loader extends View {
    constructor(params = {}) {
        super(templateLayout);
    }
}

export default Loader;
