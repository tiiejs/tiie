import TiieObject from 'Tiie/Object';

import Browser from "Tiie/Environment/Browser";
import Screen from "Tiie/Environment/Screen";

const cn = 'Environment';

class Environment extends TiieObject {
    constructor(components) {
        super();

        let p = this.__private(cn, {
            browser : null,
            screen : null,
        });
    }

    browser() {
        let p = this.__private(cn);

        if(p.browser === null) {
            p.browser = new Browser();
        }

        return p.browser;
    }

    screen() {
        let p = this.__private(cn);

        if(p.screen === null) {
            p.screen = new Screen();
        }

        return p.screen;
    }
}

export default Environment;
