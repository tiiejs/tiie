import Widget from "Tiie/Widgets/Widget";

import templateLayout from './resources/layout.html';
import clone from 'Tiie/Utils/clone';
import style from './resources/style.scss';

const cn = "Form";

/**
 * Class for creating and handling forms.
 */
class Form extends Widget {
    static get FIELD_TYPE_WIDGET () {return 'widget'};
    static get FIELD_TYPE_SECTION () {return 'section'};
    static get FIELD_TYPE_TEXT () {return 'text'};

    constructor(data = {}, params = {}) {
        super(templateLayout, params);

        let p = this.__private(cn, {
            id : 0,

            // Widgets list
            widgets : {},
            footer : params.footer ? params.footer : null,
            params : {
                classCell : ["tiie--display-flex", "tiie--align-items-flex-start", "tiie--flex-direction-column"],

                styleRowBorderBottom : this.__boolean(params.styleRowBorderBottom),
                styleRowBorderBottomClass : 'tiie--border-bottom-dotted-1',
            }
        });

        if (this.__boolean(params.styleRowBorderBottomClass)) {
            p.params.styleRowBorderBottomClass = params.styleRowBorderBottomClass;
        }

        this.set("-structure", data.structure ? data.structure : []);
        this.set("-value", data.value ? data.value : {});
        this.set("-data", data.data ? data.data : {type : 'default'});
        this.set("-buttons", data.buttons ? data.buttons : []);

        if (p.footer) {
            p.footer.append(this.element('footer'));
        }

        this.element("footer").on("click", "button", (event) => {
            let target = this.$(event.currentTarget),
                id = target.data("id"),
                button = this.get("buttons").find(button => button.id == id)
            ;

            if (button === undefined) {
                this.log(`Button ${id} is not defined at form.`, "warn");
            }else{
                this.emit(`button.${id}:click`, {
                    target : button,
                    event,
                });

                if (button.id == "submit") {
                    this.emit(`form:submit`, {
                        target : this,
                        event,
                    });
                }
            }
        });

        this.on([
            "structure",
        ], () => {
            this.reload();
        }, this.id());

        this.on([
            "state",
        ], () => {
            this._reloadState();
        }, this.id());

        this.on([
            "value",
        ], () => {
            this._reloadValue();
        }, this.id());

        this.on([
            "buttons",
        ], () => {
            this._reloadButtons();
        }, this.id());
    }

    /**
     * Zwraca lub wpina kontrolkę na formularzu.
     *
     * @param {string} id Identyfikator kontrolki
     * @param {Widget} widget Obiekt kontrolki
     * @return {this|Widget}
     */
    widget(id, widget) {
        let p = this.__private(cn);

        this.components().set(`#form.widget.${id}`, widget);

        if (widget === undefined) {
            if (p.widgets[id] === undefined) {
                return null;
            }else{
                return p.widgets[id]
            }
        }else{
            let value = this.get("value");

            // Usuwam poprzedni widget
            if (p.widgets[id]) {
                p.widgets[id].off(this.id());
                p.widgets[id].remove();
            }

            // Wpinam nowy widget.
            p.widgets[id] = widget;

            // Dla każdej zmiany wartości widgetu, aktualizuje wartość danych w
            // formularzu.
            p.widgets[id].on("value:change", (event) => {
                let value = this.get("value");
                value[id] = event.this.get("value");

                // Ustawiam wartość dla formularza, nie emituje zmiany dla
                // samego formularza.
                this.set("value", value, {ommit : this.id()});
            }, this.id());

            // Attach element to DOM.
            let target = this.element("fields").element(id);

            if (target) {
                // Niektóre widgety które korzystaja z pluginow takich jak
                // Select2 do poprawnego zaainicjowania musza byc w domie.
                p.widgets[id].target(target);

                if (!p.widgets[id].is("rendered")) {
                    p.widgets[id].render();
                }
            }

            if (value.hasOwnProperty(id)) {
                // Wartość jest już zdefiniowana, wiec ustawiam ja na widgecie
                p.widgets[id].set("value", value[id], {ommit : this.id()});
            } else {
                p.widgets[id].set("value", null, {ommit : this.id()});
            }

            return this;
        }
    }

    /**
     * Return list of all fields at form. Fields are widgets, text fields and
     * sections.
     *
     * You can use 'type' params to select specific type of fields.
     *
     * @param {object}
     * - type
     *
     * @return {Array} List with ids of fields.
     */
    fields(params = {}) {
        const p = this.__private(cn);

        let fields = [];

        this.get('&structure').forEach((row) => {
            row.forEach((field) => {
                if (params.type) {
                    if (params.type == field.type) {
                        fields.push(field.id);
                    }
                } else {
                    fields.push(field.id);
                }
            });
        });

        return fields;
    }

    /**
     * Sprawdza czy podany widget jest zdefiniowany w strukturze formularza.
     *
     * @param {string} widget
     * @return {int} 0 lub 1
     */
    atStructure(id) {
        let p = this.__private(cn),
            found = 0,
            structure = this.get("&structure")
        ;

        for(let i = 0, length = structure.length; i < length; i++) {
            let row = structure[i];

            if (found) {
                break;
            }

            for(let j = 0, lengthRow = row.length; j < lengthRow; j++){
                if (row[j].id == id) {
                    found = 1;

                    break;
                }
            }
        }

        return found;
    }

    /**
     * Add button.to for
     *
     * @return $this
     */
    button(button = {}) {
        let p = this.__private(cn),
            buttons = this.get("buttons")
        ;

        // Push button to list of buttons
        buttons.push(button);

        // Set button, this couse reload of buttons
        this.set("buttons", buttons);

        return this;
    }

    /**
     * Submit for
     *
     * @return $this
     */
    submit() {
        let p = this.__private(cn);

        this.emit("form:submit");

        return this;
    }

    /**
     * Renderuje strukture formularza.
     */
    render() {
        super.render();

        let p = this.__private(cn),
            i,
            target,
            html = [],
            structure = this.get("structure"),
            left,
            width,
            labelWidth,
            col
        ;

        structure.forEach((row) => {
            html.push(`<div class="row tiie-form__row ${p.params.styleRowBorderBottom ? p.params.styleRowBorderBottomClass : ''}">`);

            left = 12;

            // Przechodzę po wszystkich elementach. Te elementy które mają
            // podaną szerokość, to odejmuję tą szerokość od dostępnej
            // szerokości.
            row.forEach((element) => {
                element.width = element.width === undefined ? null : parseInt(element.width);
                element.labelWidth = element.labelWidth === undefined ? null : parseInt(element.labelWidth);

                if (element.width) {
                    left -= element.width;
                }

                if (element.label) {
                    // Mamy label, więc sprawdzam czy podano szerokość dla
                    // labela.
                    if (element.labelWidth) {
                        left -= element.labelWidth
                    }
                }
            });

            row.forEach((element) => {
                // Przechodzę po pozostałych elementach. Jeśli element ma label
                // a nie ma podanej szerokości, to przydzielam 2 dla labela.
                if (element.label) {
                    if (element.labelWidth == null) {
                        element.labelWidth = 2;

                        left -= 2;
                    }
                }
            });

            // Sprawdzam czy pozostały elementy bez przypisanej szerokości.
            const leaved = row.filter(element => element.width == null).length;

            if (leaved > 0) {
                const rest = Math.floor(left/leaved);

                // Są elementy bez zdefiniowanej szerokości.
                row.forEach((element) => {
                    if (element.width == null) {
                        element.width = rest;

                        left -= rest;
                    }
                });
            }

            row.forEach((element) => {
                if (element.type == "widget") {
                    let labelHtml, widgetHtml;

                    if (element.label) {
                        labelHtml = `
                            <div class="col col-md-${element.labelWidth} col-lg-${element.labelWidth} col-sm-12 ${p.params.classCell.join(' ')}" name="${element.id}LabelCell">
                                <label class="text-left" name="${element.id}Label" for="${element.id}">${element.label}</label>
                            </div>
                        `;
                    }

                    widgetHtml = `<div class="col tiie-form__col col-md-${element.width} col-lg-${element.width} col-sm-12 ${p.params.classCell.join(' ')}" name="${element.id}"></div>`;

                    if (this.__boolean(element.reverse)) {
                        html.push(widgetHtml);
                        html.push(labelHtml);
                    } else {
                        html.push(labelHtml);
                        html.push(widgetHtml);
                    }
                }else if(element.type == "text") {
                    html.push(`<div class="col __text col-md-${element.width} col-lg-${element.width} col-sm-12 ${p.params.classCell.join(' ')}" name="${element.id}">${element.value === undefined ? "" : element.value}</div>`)
                }else if(element.type == "section") {
                    html.push(`<div class="col tiie-form__section col-md-${element.width} col-lg-${element.width} col-sm-12 ${p.params.classCell.join(' ')}" name="${element.id}">${element.name}</div>`)
                }else {
                    this.log(`Unknow type of fom element ${element.type}`, "warn", 'Tiie.Form.Form');
                }
            });

            html.push(`</div>`);
        });

        this.element("fields").content(html.join(""));

        // Attach widgets.
        for(i in p.widgets) {
            // Sprawdzam czy istnieje kontener na widget.
            target = this.element("fields").element(i);

            if (target != null) {
                p.widgets[i].target(target);
                p.widgets[i].render();
            }
        }

        this._reloadButtons();

        return this;
    }

    _reloadValue() {
        let p = this.__private(cn),
            value = this.get("&value"),
            i
        ;

        for(i in value) {
            if (p.widgets[i]) {
                p.widgets[i].set("value", value[i], {ommit : this.id()});
            }
        }
    }

    /**
     * Reload state of for There are few types of states: error, default,
     * processing etc.
     */
    _reloadState() {
        let p = this.__private(cn),
            state = this.get("&state"),
            i,
            target,
            label,
            feedback
        ;

        // Clean state for form.
        this.element("fields").find(".tiie-form__notice").remove();
        this.element("fields").find(".tiie-form__label").removeClass("--error");

        // Clean states of widgets.
        Object.keys(p.widgets).forEach((name) => {
            p.widgets[name].set("state", {
                type : "default"
            });
        });


        if (state.type == "error" && state.errors) {
            let offsetY = null;

            for(i in state.errors) {
                feedback = state.errors[i].map((error) => {
                    return `${error.error}</br>`;
                }).join("");

                if (feedback) {
                    // Search element of error, at fields
                    if (target = this.element("fields").element(i)) {
                        // Element was found
                        target.append(`<div class="tiie-form__notice --error tiie--margin-top-10">${feedback}</div>`);
                    }

                    if (label = this.element("fields").element(`${i}Label`)) {
                        label.addClass("--error");

                        if (offsetY == null) {
                            offsetY = label.offset().top;
                        } else if (label.offset().top < offsetY) {
                            offsetY = label.offset().top;
                        }
                    }
                }

                if (this.widget(i)) {
                    // Set state for widget
                    this.widget(i).set("state", {
                        type : "error",
                        errors : state.errors[i],
                    });
                }
            }

            if (offsetY != null) {
                this.__component("@window").scroll(0, offsetY);
            }
        }
    }

    __setValue(target, name, value, emitparams = {}) {
        let p = this.__private(cn);

        if (name == "buttons") {
            if (!Array.isArray(value)) {
                throw "Buttons should be array";
            }

            // Check, if all buttons have defined id. If not then, I generate ID
            // myself.
            value = value.map((button) => {
                if (button.id === undefined) {
                    button.id = `button${p.id++}`;
                }

                button.type = button.type === undefined ? "primary" : button.type;
                button.label = button.label === undefined ? "Button" : button.label;
                button.action = button.action === undefined ? null : button.action;
                button.section = button.section === undefined ? "footer-right" : button.section;

                return button;
            });

            return super.__setValue(target, name, value, emitparams);
        } else if (name == "structure") {
            if (!Array.isArray(value)) {
                this.log("Structure of form, should be array.", "warn");

                return;
            }

            value = value.map((row) => {
                if (!Array.isArray(row)) {
                    // change row to array
                    row = [row];
                }

                return row.map((element) => {
                    element.type = element.type === undefined ? "widget" : element.type;

                    if (element.type == "section") {
                        element.width = element.widget === undefined ? 12 : element.width;
                        element.name = element.name === undefined ? "" : element.name;
                    }

                    return element;
                });
            });

            return super.__setValue(target, name, value, emitparams);
        }else{
            return super.__setValue(target, name, value, emitparams);
        }
    }

    /**
     * Reload buttons html.
     */
    _reloadButtons() {
        let p = this.__private(),
            buttons = {}
        ;

        this.get("buttons").forEach((button, i) => {
            if (buttons[button.section] == undefined) {
                buttons[button.section] = [];
            }

            buttons[button.section].push(`<button class="tiie-button --${button.type}" data-id="${button.id}" type="button">${button.label}</button>`);
        });

        if (buttons["footer.left"]) {
            this.element("footer").element("left").html(buttons["footer.left"].join(""));
        }

        if (buttons["footer.center"]) {
            this.element("footer").element("center").html(buttons["footer.center"].join(""));
        }

        if (buttons["footer.right"]) {
            this.element("footer").element("right").html(buttons["footer.right"].join(""));
        }
    }
}

export default Form;
