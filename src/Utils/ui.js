(function (scope, factory) {
    if (typeof define === "function" && define.amd) {
        define(function(){
            return factory();
        });

    } else if (typeof module === "object" && module.exports) {
        module.exports = function() {
            return factory();
        };

    } else {
        // scope.jQuery.fn.ui = factory();
    }
}(this, function () {
    "use strict";

    return {
        init() {
            let _this = this;

            jQuery.fn.ui = function(name, id, child) {
                let element = this[0];

                if (element.uis === undefined) {
                    console.warn('Html element does not support ui.', this[0]);
                    return null;
                }

                // ui, ui-id, ui-child, ui-class
                // this.element('.errors');
                // this.element('#');
                // this.element('.');

                switch (name) {
                    case '#':
                        if (this[0].hasAttribute('ui-id')) {
                            console.warn('Html element does not have ui-id attribute.', this[0]);
                        }

                        return element.getAttribute('ui-id');
                    case '.':
                        if (this[0].hasAttribute('ui-class')) {
                            console.warn('Html element does not have ui-class attribute.', this[0]);
                        }

                        return element.getAttribute('ui-class');
                }

                if (name[0] === '.') {
                    let classname = name.substring(1);

                    if (element.uis.elements[classname] === undefined) {
                        return [];
                    }else{
                        return element.uis.elements[classname];
                    }
                }

                if (element.uis.index[name] === undefined) {
                    return null;
                }else{
                    return element.uis.index[name];
                }
            }

            jQuery.fn.content = function(html) {
                this[0].innerHTML = html;
                _this._index(this[0]);
            }
        },

        ui(html) {
            let element = document.createElement('div');

            element.innerHTML = html.trim();
            element = element.childNodes[0];

            this._index(element);

            return jQuery(element);
        },

        _index(element) {
            let list,
                childs,
                i,
                j,
                jlength
            ;

            let uis = {
                index : {},
                elements : {},
            };

            list = element.querySelectorAll('[ui]');
            for(i = 0, length = list.length; i < length; i++) {
                name = list[i].getAttribute('ui');

                if (list[i].hasAttribute('ui-id')) {
                    name += '#' + list[i].getAttribute('ui-id');
                }

                uis.index[name] = jQuery(list[i]);

                // finding ui-child
                childs = list[i].querySelectorAll('[ui-child]');
                for(j = 0, jlength = childs.length; j < jlength; j++) {
                    uis.index[name + '.' + childs[j].getAttribute('ui-child')] = jQuery(childs[j]);
                }
            }

            list = element.querySelectorAll('[ui-class]');
            for(i = 0, length = list.length; i < length; i++) {
                name = list[i].getAttribute('ui-class');

                if (uis.elements[name] === undefined) {
                    uis.elements[name] = [];
                }

                uis.elements[name].push(jQuery(list[i]));
            }

            // element = element.children[0];
            element.uis = uis;
        }
    }
}));
