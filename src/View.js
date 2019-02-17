import TiieObject from "Tiie/Object";
import jQuery from "jquery";
import Loader from "Tiie/Loader/Loader";
import clone from "Tiie/Utils/clone";

import doT from "dot";

const cn = "View";

class View extends TiieObject {
    constructor(template = "<div></div>") {
        super();

        let p = this.__private(cn, {
            target : null,
            notifications : null,
            loader : null,
            loaderTimeout : null,
            // element : this.create(template),
            // elements : this._createElements(template),
            rendered : 0,
            templates : [],
            views : {},
            timeout : {
                reload : null
            },
        });

        p.elements = this._createElements(template);
        p.elements.forEach(element => this._attachEventsListener(element));

        this.set("@ready", 0, {silently : 1});
        this.set("@rendered", 0, {silently : 1});
        this.set("@visible", 1, {silently : 1});
        this.set("@visible", 1, {silently : 1});

        // this.set("@components", this.__components(), {silently : 1});
        // this.set("@icons", this.__components().get("@icons"), {silently : 1});

        // Init doT
        // doT.templateSettings = {
        //     // evaluate:    /\{\{([\s\S]+?)\}\}/g,
        //     // interpolate: /\{\{=([\s\S]+?)\}\}/g,
        //     // encode:      /\{\{!([\s\S]+?)\}\}/g,
        //     // use:         /\{\{#([\s\S]+?)\}\}/g,
        //     // define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
        //     // conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
        //     // iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
        //     // varname: 'it',
        //     varname: "it|component",
        //     strip: true,
        //     append: true,
        //     selfcontained: false
        // };

        // TODO Syncing params.
        // Parametry związane z synchronizacją można przenieść do przestrzeni
        // obiektu.
        this.set("@syncing", 0, {silently : 1});
        this.set("@synced", 0, {silently : 1});

        this.on("@syncing:change", (event, params) => {
            if (this.is("@syncing")) {
                if(p.loaderTimeout) {
                    clearTimeout(p.loaderTimeout);
                }

                // clearTimeout
                p.loaderTimeout = setTimeout(() => {
                    this.__loader().show();
                }, 1000);
            } else {
                if(p.loaderTimeout) {
                    clearTimeout(p.loaderTimeout);
                }

                this.__loader().hide();
            }
        });

        // attach to standard events
        // this.element().
        // Set default attribute
        // this.set(".@ready", 0, {silently : 1});
        // this.set(".@loading", 0, {silently : 1});
    }

    __section(name, events, template) {
        let p = this.__private(cn);

        this.on(events, (event, params) => {
            if(typeof template == "function") {

            } else {
                this.element(name).content(this.template(template)(this.data()));
            }
        });
    }

    __view(name, view) {
        let p = this.__private(cn);

        if (view != undefined) {
            return p.views[name] = view;
        } else {
            return !p.views[name] ? null : p.views[name];
        }
    }

    /**
     * Return function to compile template.
     *
     * @param {string} template
     * @return {function}
     */
    __template(template) {
        let p = this.__private(cn),
            found = p.templates.find(t => t.template == template)
        ;

        if (found == undefined) {
            let dotfunction = doT.template(template),
                components = this.__components()
            ;

            found = {
                template,
                function : function(data) {
                    let moved = {};

                    Object.keys(data).forEach((key) => moved[key] = data[key]);

                    moved["@components"] = components;
                    moved["@icons"] = components.get("@icons");
                    // moved["@view"] = components.get("@icons");

                    return dotfunction(moved);
                },
            };

            p.templates.push(found);
        }

        return found.function;
    }

    // _helpers() {
    // }

    _attachEventsListener(element) {
        let p = this.__private(cn);

        // Attach to attribute.
        // this.element().on("click", "[action-click]", (event) => {
        //     let target = this.$(event.currentTarget),
        //         data = clone(target.data())
        //     ;

        //     data.event = event;

        //     this.emit(`actions.${target.attr("action-click")}`, data);

        //     // this.on("events.close")
        //     // this.on("actions.close:run")
        //     // this.on("actions.close:finied")

        //     event.stopPropagation();
        //     event.preventDefault();
        // });

        // this.on("data.firstName:init");
        // this.on("data.firstName:init");
        // this.on("events.")
        // this.on("events.close");
        // this.on("events.close:emit");
        // this.on("data.close:change");

        this.element().on("click", "[event-click]", (event) => {
            let target = this.$(event.currentTarget);
            let data = target.data();

            if (data.event == undefined) {
                data.event = event;
            }

            this.emit(`events.${target.attr("event-click")}:emit`, data);

            event.stopPropagation();
            event.preventDefault();
        });
    }

    _createElements(html) {
        let p = this.__private(cn),
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

    __loader() {
        let p = this.__private(cn);

        if (p.loader == null) {
            if (!this.__components().exists("@loader")) {
                this.log("There is no '@loader' component.", "warn", "Tiie.View");

                return null;
            } else {
                p.loader = this.__components().get("@loader").attach(this.element());
            }
        }

        return p.loader;
    }

    /**
     * Return notification component for view.
     *
     * @return {Tiie.Notifications.Notifications|null}
     */
    __notifications() {
        let p = this.__private(cn);

        if (!p.notifications) {
            if (!this.__components().exists("@notifications")) {
                this.log("There is no '@notifications' component.", "warn", "Tiie.View");

                return null;
            } else {
                p.notifications = this.__components().get("@notifications").attach(this.element());
            }
        }

        return p.notifications;
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
        let p = this.__private(cn);

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
        let p = this.__private(cn);

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
     * Set or return a content for given element.
     *
     * @param {string} name
     * @param {string} content
     * @param {object} data
     * @return {string|this}
     */
    __content(...args) {
        let p = this.__private(cn),
            element = this.element(args[0])
        ;

        if (element == null) {
            this.log(`Element ${args[0]} not found.`, "warn", "Tiie.View");

            if (args.length == 1) {
                return null;
            } else {
                return this;
            }
        }

        if(args.length == 1) {
            return element.html();
        } else if(args.length == 2) {
            element.html(this.__template(args[1])(this.data({clone : 0})));

            return this;
        } else if(args.length >= 3) {
            element.html(this.__template(args[1])(args[2]));

            if (args.length > 3) {
                this.log(`Unsuported number of params for '__content' method.`, "notice", "Tiie.View");
            }

            return this;
        }
    }

    show() {
        let p = this.__private(cn);

        p.elements.forEach((element) => {
            element.show();
            // p.target.append(element);
        });

        this.set("@visible", 1);

        return this;
    }

    hide() {
        let p = this.__private(cn);

        p.elements.forEach((element) => {
            element.hide();
            // p.target.append(element);
        });

        this.set("@visible", 0);

        return this;
    }

    /**
     * Display view object base on data of object.
     *
     * @return this
     */
    render() {
        let p = this.__private(cn);

        p.rendered = 1;

        // attach tooltips
        // this.element().find('[title]').tooltip();
        // this.element().find('[data-toggle="tooltip"]').tooltip();

        return this;
    }

    is(name) {
        let p = this.__private(cn);

        switch (name) {
            case "rendered":
                return p.rendered ? 1 : 0;
            default :
                return super.is(name);
        }
    }

    /**
     * Return container for view or set.
     *
     * @params {jQuery} target
     *
     * @return {jQuery|null|this}
     */
    // target(target) {
    target(...args) {
        let p = this.__private(cn);

        if(args.length > 1) this.log(`Wrong number of params.`, "notice", "Tiie.View::target", args);

        if(args.length == 0) {
            return p.target ? p.target : null;
        } else if(args.length >= 1) {
            // Move elements to new target.
            p.target = args[0];

            p.elements.forEach((element) => {
                p.target.append(element);
            });

            return this;
        }
    }

    /**
     * Zwraca element o podanej nazwie lub null jeśli nie został znaleziony.
     * Jeśli nazwa nie zostanie podana, to zwraca referencje do kontenera.
     *
     * @param {string} name
     * @return jQuery
     */
    element(name) {
        let p = this.__private(cn);

        if (name === undefined) {
            return p.elements[0];
        } else if (name === "__root") {
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
        let p = this.__private(cn);

        p.elements.forEach((element) => {
            element.remove();
        });

        return this;
    }

    find(selector) {
        let p = this.__private(cn);

        return p.elements[0].find(selector);
    }

    html(html) {
        let p = this.__private(cn);

        if (html == undefined) {
            return p.elements[0].html();
        }else{
            return p.elements[0].html(html);
        }
    }
}


export default View;
