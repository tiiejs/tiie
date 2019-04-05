import TiieObject from 'Tiie/Object';

const cn = 'Config';

class Screen extends TiieObject {

    // availHeight() {
    //     return screen.availHeight;
    // }

    // availLeft() {
    //     return screen.availLeft;
    // }

    // availTop() {
    //     return screen.availTop;
    // }

    // availWidth() {
    //     return screen.availWidth;
    // }

    // colorDepth() {
    //     return screen.colorDepth;
    // }

    height() {
        return screen.height;
    }

    width() {
        return screen.width;
    }

    // orientation() {
    //     return screen.orientation;
    // }

    // // ScreenOrientation {angle: 0, type: "portrait-primary", onchange: null}
    // pixelDepth() {
    //     return screen.pixelDepth;
    // }
}

export default Screen;
