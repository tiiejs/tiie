import TiieObject from 'Tiie/Object';

const cn = 'Responsive';

class Responsive extends TiieObject {
    constructor() {
        super();

        let p = this.__private(cn);
    }

    calculate(relativeTo, size) {
        let p = this.__private(cn),
            relativeToSize = this.resolveSize(relativeTo),
            sizes = [],
            selected = null,
            selectedSize = null
        ;

        if(typeof size == "object") {
            // for(let i=0; i < Responsive.SIZES.length; i++) {
            //     let s = Responsive.SIZES[i];

            //     if(s == relativeToSize) {
            //         sizes.push(s);
            //         break;
            //     } else {
            //         sizes.push(s);
            //     }
            // }

            // do {
            //     selected = sizes.pop();

            //     if(size[selected] != undefined) {
            //         break;
            //     }
            // } while (sizes.length)
            // selectedSize = size[selected];

            selectedSize = this.selectValue(relativeTo, size);
        } else if(typeof size == "string") {
            selectedSize = size;
        } else {
            return relativeTo;
        }

        // Calculate
        let divisions = {
            tiny : 0.1,
            small : 0.25,
            normal : 0.50,
            large : 0.75,
            fullscreen : 1,
        };

        let division = divisions[selectedSize];

        if (division == undefined) {
            division = divisions.normal;
        }

        return Math.round(relativeTo * division);
    }

    selectValue(relativeTo, values) {
        let p = this.__private(cn),
            relativeToSize = this.resolveSize(relativeTo),
            sizes = [],
            selected = null,
            selectedSize = null
        ;

        if(
            typeof values === "string" ||
            typeof values === "number" ||
            Array.isArray(values) ||
            values === undefined ||
            values === null
        ) {
            return values;
        }

        for(let i=0; i < Responsive.SIZES.length; i++) {
            let s = Responsive.SIZES[i];

            if(s == relativeToSize) {
                sizes.push(s);
                break;
            } else {
                sizes.push(s);
            }
        }

        do {
            selected = sizes.pop();

            if(values[selected] != undefined) {
                break;
            }
        } while (sizes.length);

        return values[selected] !== undefined ? values[selected] : null;
    }

    resolveSize(size) {
        let p = this.__private(cn);

        if(size >= 1200) {
            return Responsive.SIZE_EXTRA_LARGE;
        } else if(size >= 992) {
            return Responsive.SIZE_LARGE;
        } else if(size >= 768) {
            return Responsive.SIZE_MEDIUM;
        } else if(size >= 576) {
            return Responsive.SIZE_SMALL;
        } else if(size < 566) {
            return Responsive.SIZE_EXTRA_SMALL;
        }
    }
}

Responsive.SIZE_EXTRA_SMALL = "esm";
Responsive.SIZE_SMALL = "sm";
Responsive.SIZE_MEDIUM = "md";
Responsive.SIZE_LARGE = "lg";
Responsive.SIZE_EXTRA_LARGE = "xl";

Responsive.EM = Responsive.SIZE_EXTRA_SMALL;
Responsive.SM = Responsive.SIZE_SMALL;
Responsive.MD = Responsive.SIZE_MEDIUM;
Responsive.LG = Responsive.SIZE_LARGE;
Responsive.XL = Responsive.SIZE_EXTRA_LARGE;

Responsive.SIZES = [
    Responsive.SIZE_EXTRA_SMALL,
    Responsive.SIZE_SMALL,
    Responsive.SIZE_MEDIUM,
    Responsive.SIZE_LARGE,
    Responsive.SIZE_EXTRA_LARGE,
];

export default Responsive;
