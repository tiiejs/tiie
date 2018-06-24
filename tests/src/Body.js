import $ from 'jquery';

class Body {
    constructor() {
        const  p = this.private = {};

        p.body = $("<div></div>");

        $("#body").prepend(p.body)
    }

    element() {
        return this.private.body;
    }

    find(selector) {
        return this.private.body.find(selector);
    }

    clean() {
        const p = this.private;

        p.body.html("");

        return this;
    }
}

export default Body;
