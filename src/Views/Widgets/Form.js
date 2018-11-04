import View from "Topi/View";
import Widget from "Topi/Views/Widgets/Widget";

import merge from "Topi/Utils/merge";
import templateLayout from "Topi/Views/Widgets/Form.layout.html";

const cn = "Form";

/**
 * Klasa do wyświetlania formularzy.
 */
class Form extends Widget {
    constructor(params = {}) {
        super(templateLayout, params);

        params = merge({
            structure : [],
            value : {},
            state : {
                type : "default",
            }
        }, params);

        let p = this.__private(cn, {
            id : 0,
            // Lista przycisków
            buttons : [],
            // Ostatni stan
            state : null,
            // Lista widget
            widgets : {},
            footer : params.footer === undefined ? null : params.footer,
        });

        this.set("-structure", params.structure === undefined ? [] : params.structure);
        this.set("-value", params.value === undefined ? {} : params.value);
        this.set("-state", params.state === undefined ? {} : params.state);
        this.set("-buttons", params.buttons === undefined ? [] : params.buttons);

        if (p.footer != null) {
            p.footer.append(this.element('footer'));
        }

        this.element("footer").on("click", "button", (event) => {
            let target = this.$(event.currentTarget),
                id = target.data("id"),
                button = this.get("buttons").find(button => button.id == id)
            ;

            if (button === undefined) {
                this.log(`Button ${id} is not defined at for`, "warn");
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

        if (widget === undefined) {
            if (p.widgets[id] === undefined) {
                return null;
            }else{
                return p.widgets[id]
            }
        }else{
            let value = this.get("value");

            // Usuwam poprzedni widget
            if (p.widgets[id] != undefined) {
                p.widgets[id].off(this.id());
                p.widgets[id].detach();

                if (value[id] !== undefined) {
                    // Usuwam wartość
                    delete value[id];
                }
            }

            // Wpinam nowy widget
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

            // Szukam miejsca docelowego
            let target = this.element("fields").element(id);

            if (target != null) {
                // Niektóre widgety które korzystaja z pluginow takich jak
                // Select2 do poprawnego zaainicjowania musza byc w domie.
                p.widgets[id].target(target);

                if (!p.widgets[id].is("rendered")) {
                    p.widgets[id].render();
                }
            }

            if (value[id] !== undefined) {
                // Wartość jest już zdefiniowana, wiec ustawiam ja na widgecie
                p.widgets[id].set("value", value[id], {ommit : this.id()});
            }else{
                // Wartość pobieram z widgeta
                value[id] = p.widgets[id].get("value");
            }

            this.set("value", value, {ommit : this.id()});

            return this;
        }
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

            for(let j = 0, lengthRow = row.length; j < lengthRow; j++){
                if (row[j].id == id) {
                    found = 1;
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
            html.push(`<div class="grid-x grid-padding-x topi--margin-bottom-10">`);

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
                    if (element.label) {

                        html.push(`
                            <div class="cell __cellLabel medium-${element.labelWidth} large-${element.labelWidth} small-12" name="${element.id}LabelCell">
                                <label class="text-left" name="${element.id}Label" for="${element.id}">${element.label}</label>
                            </div>
                        `);
                    }

                    html.push(`<div class="cell __cell medium-${element.width} large-${element.width} small-12" name="${element.id}"></div>`)
                }else if(element.type == "text") {
                    html.push(`<div class="cell __text medium-${element.width} large-${element.width} small-12" name="${element.id}">${element.value === undefined ? "" : element.value}</div>`)
                }else if(element.type == "section") {
                    html.push(`<div class="cell __section medium-${element.width} large-${element.width} small-12" name="${element.id}">${element.name}</div>`)
                }else {
                    this.log(`Unknow type of fom element ${element.type}`, "warn");
                }
            });

            html.push(`</div>`);
        });

        this.element("fields").content(html.join(""));

        // Przepinam wszystkie widgety
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
            if (p.widgets[i] != undefined) {
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
            i
        ;

        // clean state
        this.element("fields").find(".__notice").remove();
        this.element("fields").find(".__label").removeClass("--error");

        // this.element("fields").find(".topi-form__cell--error").removeClass("topi-form__cell--error");

        // Clean all states
        for(let widgetName in p.widgets) {
            p.widgets[widgetName].set("state", {
                type : "default"
            });
        }

        switch (state.type) {
            case "error":
                // Error
                for(i in state.errors){
                    let feedback = state.errors[i].map((error) => {
                        return `${error.error}</br>`;
                    }).join("");

                    if (feedback != "") {
                        // Search element of error, at fields
                        let target = this.element("fields").element(i);

                        if (target != null) {
                            // Element was found
                            target.append(`<div class="__notice --error">${feedback}</div>`);
                        }

                        // check if there is label
                        let label = this.element("fields").element(`${i}Label`);

                        if (label != null) {
                            label.addClass("--error");

                            // let cell = this.element("fields").element(`${i}LabelCell`);
                        }
                    }

                    // Find widget
                    let widget = this.widget(i);

                    if (widget != null) {
                        // Set state for widget
                        widget.set("state", {
                            type : "error",
                            errors : state.errors[i],
                        });
                    }
                }

                break;
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
        let p = this.__private();

        let buttons = {};

        this.get("buttons").forEach((button, i) => {
            if (buttons[button.section] == undefined) {
                buttons[button.section] = [];
            }

            buttons[button.section].push(`<button class="topi-button --${button.type}" data-id="${button.id}" type="button">${button.label}</button>`);
        });

        if (buttons["footer.left"] !== undefined) {
            this.element("footer").element("left").html(buttons["footer.left"].join(""));
        }

        if (buttons["footer.center"] !== undefined) {
            this.element("footer").element("center").html(buttons["footer.center"].join(""));
        }

        if (buttons["footer.right"] !== undefined) {
            this.element("footer").element("right").html(buttons["footer.right"].join(""));
        }
    }
}

export default Form;
