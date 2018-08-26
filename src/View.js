import TopiObject from 'Topi/Object';
import jQuery from "jquery";

import doT from 'dot';

const cn = 'View';
class View extends TopiObject {
    constructor(template = "<div></div>") {
        super();

        let p = this.private(cn, {
            target : null,
            // element : this.create(template),
            // elements : this._createElements(template),
            rendered : 0,
            timeout : {
                reload : null
            },
        });

        p.elements = this._createElements(template);
        p.elements.forEach(element => this._attachEventsListener(element));

        // attach to standard events
        // this.element().
        // Set default attribute
        // this.set(".view.ready", 0, {silently : 1});
        // this.set(".view.loading", 0, {silently : 1});
    }

    _attachEventsListener(element) {
        let p = this.private(cn);

        this.element().on('click', '[event-click]', (event) => {
            let target = this.$(event.currentTarget);
            let data = target.data();

            if (data.event == undefined) {
                data.event = event;
            }

            this.emit(`${target.attr('event-click')}:click`, data);

            event.stopPropagation();
            event.preventDefault();
        });
    }

    _createElements(html) {
        let p = this.private(cn),
            elements = [],
            div,
            i
        ;

        div = document.createElement("div");
        div.innerHTML = html;

        for (i = 0; i < div.children.length; i++) {
            elements.push(jQuery(div.children[i]));
        }

        return elements;
    }

    content(html) {
        return this.element().content(html);
    }

    $(object) {
        return jQuery(object);
    }

    /**
     * Tworzy obiekt widoku.
     *
     * @return {Object}
     */
    create(html) {
        let p = this.private(cn);

        let wrapper = document.createElement("div");
        wrapper.innerHTML = html;

        return wrapper;
    }

    /**
     * Przeładowanie widoku. Przeładowanie widoku jest uruchamiane z pewnym
     * opóźnienie
     *
     * @return this
     */
    reload() {
        let p = this.private(cn);

        if (p.timeout.reload != null) {
            clearTimeout(p.timeout.reload);
        }

        p.timeout.reload = setTimeout(() => this.render(), 100);

        return this;
    }

    template(template) {
        return doT.template(template);
    }

    /**
     * Wyrenderowanie obiektu do stanu poczatkowego.
     *
     * @return this
     */
    render() {
        let p = this.private(cn);

        p.rendered = 1;

        // attach tooltips
        // this.element().find('[title]').tooltip();
        // this.element().find('[data-toggle="tooltip"]').tooltip();

        return this;
    }

    is(name) {
        let p = this.private(cn);

        switch (name) {
            case 'rendered':
                return p.rendered ? 1 : 0;
            default :
                return super.is(name);
        }
    }

    /**
     * Zmiana kontenera dla widoku.
     *
     * @params {Object}
     * @return {Object}
     */
    target(target) {
        let p = this.private(cn);

        switch (arguments.length) {
            case 0:
                return p.target === undefined ? null : p.target;
            case 1:
                // Przenosze element w nowe miejsce.
                p.target = target;

                p.elements.forEach((element) => {
                    p.target.append(element);
                });

                return this;
        }

        this.log('Unsuported params', "warn");
    }

    /**
     * Zwraca element o podanej nazwie lub null jeśli nie został znaleziony.
     * Jeśli nazwa nie zostanie podana, to zwraca referencje do kontenera.
     *
     * @param {string} name
     * @return jQuery
     */
    element(name) {
        let p = this.private(cn);

        if (name === undefined) {
            return p.elements[0];
        } else if (typeof name == "number"){
            return p.elements[name] === undefined ? null : p.elements[name];
        }else{
            let found = null;

            for(let i = 0; i < p.elements.length; i++) {
                found = p.elements[i].element(name);

                if (found !== null) {
                    break;
                }
            }

            return found;
        }
    }

    remove() {
        let p = this.private(cn);

        p.elements.forEach((element) => {
            element.remove();
        });

        return this;
    }

    find(selector) {
        let p = this.private(cn);

        return p.elements[0].find(selector);
    }

    html(html) {
        let p = this.private(cn);

        if (html == undefined) {
            return p.elements[0].html();
        }else{
            return p.elements[0].html(html);
        }
    }
}

export default View;
