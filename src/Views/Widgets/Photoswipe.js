import Widget from 'Topi/Views/Widgets/Widget';

import template from 'Topi/Views/Widgets/Photoswipe.html';

const cn = 'Photoswipe';
class Photoswipe extends Widget {
    constructor(params) {
        super(template);

        let p = this.private(cn, {
            value : [],
        }, params);
    }

    render() {
        super.render();

        let p = this.private(cn);

        // build items array
        // var items = [
        //     {
        //         src: 'https://placekitten.com/600/400',
        //         w: 600,
        //         h: 400
        //     },
        //     {
        //         src: 'https://placekitten.com/1200/900',
        //         w: 1200,
        //         h: 900
        //     }
        // ];

        // define options (if needed)
        var options = {
            // optionName: 'option value'
            // for example:
            index: 0 // start at first slide
        };

        // Initializes and opens PhotoSwipe
        let gallery = new PhotoSwipe(this.element(), PhotoSwipeUI_Default, this.value(), options);

        gallery.init();


        this.trigger('render');

        return this;
    }

    rerender() {
    }

    value(value) {
        if (value == "") {
            value = null;
        }

        return this.attribute(cn, 'value', value);
    }
}

export default Photoswipe;
