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

    jQuery.fn.extend({
        animateCss: function(animationName, callback) {
            var animationEnd = (function(el) {
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                return animations[t];
                }
            }
            })(document.createElement('div'));

            this.addClass('animated ' + animationName).one(animationEnd, function() {

            jQuery(this).removeClass('animated ' + animationName);

            if (typeof callback === 'function') callback();
            });

            return this;
        },
    });
}));
