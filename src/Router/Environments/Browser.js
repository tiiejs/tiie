import TiieObject from 'Tiie/Object';

const cn = "Browser";

class Browser extends TiieObject {

    constructor() {
        if ("onhashchange" in window) {
            window.onhashchange = () => {
                this.set("urn", window.location.hash);

                // if (p.dispatch) {
                //     this._dispatch(this.urn());
                // }
            };
        }else{
            // todo
            // setInterval(this._dispatch.bind(this), 1000);
        }
    }
}

export default Browser;
