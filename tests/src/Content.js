import $ from 'jquery';

class Content {
    constructor() {
        const  p = this.private = {};

        p.content = $(`
            <div style="
                width: 70%;
                margin: 0 auto;
                padding: 20px;
                border: 1px silver solid;
                margin-top: 79px;
            "></div>
        `);

        $("body").prepend(p.content)
    }

    element() {
        return this.private.content;
    }

    body() {
        return $("body");
    }

    find(selector) {
        return this.private.content.find(selector);
    }

    clean() {
        const p = this.private;

        // p.content.html("");

        return this;
    }
}

export default Content;
