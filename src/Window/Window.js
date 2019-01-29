import TiieObject from 'Tiie/Object';

const cn = 'Window';
class Window extends TiieObject {
    scroll(x, y) {
        window.scrollTo(x, y);

        return this;
    }
}


export default Window;
