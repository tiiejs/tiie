(function (scope, factory) {
    if (typeof module === "object" && module.exports) {
        // module.exports = factory(require("jquery"));
        module.exports = factory(require("jquery"));
    } else if (typeof define === "function" && define.amd) {
        define(['jquery'], function(jquery){
            return factory(jquery);
        });
    } else {
        factory(jQuery);
    }
}(this, function (jQuery) {
    "use strict";

    let element = {
        reindex(object) {
            let i,
                name,
                list,
                length,
                elements = {}
            ;

            list = object.querySelectorAll("[name]");

            // Go throught all elements with "name" attribute
            for(i = 0, length = list.length; i < length; i++) {
                elements[list[i].getAttribute("name")] = jQuery(list[i]);
            }

            // todo Zastąpić atrybut "ui" atrybutem "name".
            // Tymczasowo odczytuje atrybut "ui"
            list = object.querySelectorAll("[ui]");

            // Go throught all elements with name attribute
            for(i = 0, length = list.length; i < length; i++) {
                elements[list[i].getAttribute("ui")] = jQuery(list[i]);
            }

            object.elements = elements;
        }
    };

    // Save previos html function
    let jqueryHtml = jQuery.fn.html;

    jQuery.fn.html = function(value) {
        // if (value == undefined) {
        //     return jqueryHtml.call(this);
        // }else{
        //     let jq = jQuery(this);

        //     if(jq.children().length) {
        //         jq.children().fadeOut("slow", () => {
        //             jqueryHtml.call(this, value);

        //             element.reindex(this[0]);
        //         });
        //     } else {
        //         jqueryHtml.call(this, value);

        //         element.reindex(this[0]);
        //     }
        // }

        if (value == undefined) {
            return jqueryHtml.call(this);
        }else{
            let result = jqueryHtml.call(this, value);

            element.reindex(this[0]);

            return result;
        }
    };

    // todo Zastąpić metodę content metodą html
    jQuery.fn.content = function(value) {
        return jQuery.fn.html.call(this, value);
    };

    // jQuery.fn.ui = function(name) {
    //     return jQuery.fn.element.call(this, name);
    // };

    jQuery.fn.element = function(name) {
        let object = this[0];

        if (object.getAttribute("name") === name) {
            return jQuery(object);
        }

        if (object.elements === undefined) {
            element.reindex(object);
        }

        return object.elements[name] === undefined ? null : object.elements[name];
    };

    return element;
}));
