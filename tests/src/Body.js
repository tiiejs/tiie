import $ from 'jquery';

class Body {
    constructor() {
        const  p = this.private = {};

        p.body = $("<div></div>");

        $("#body").prepend(p.body)
    }

    body() {
        return this.private.body;
    }

    clean() {
        const p = this.private;

        p.body.html("");

        return this;
    }
}

export default Body;
