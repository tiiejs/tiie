import Action from "Tiie/Action";
import ViewErrorPage from "Tiie/Views/ErrorPage/ErrorPage";

import templateLayout from "./resources/layout.html";

const cn = 'Error';
class Error extends Action {
    async run(params = {}) {
        let p = this.__private(cn);

        this.view(templateLayout);

        return super.run(params).then(() => {
            this.__view("errorPage", new ViewErrorPage({
                error : params.error,
                locations : this.__component("@router").history(),
            }));

            this.__view("errorPage")
                .target(this.view().element())
                .on("events.goToLocation", (event, params) => {
                    let location = event.this.get("&locations").find(l => l.id == params.id);

                    this.__component("@router").redirect(location.urn);
                })
                .reload()
            ;
        });
    }

    async reload(params) {
        let p = this.__private(cn);

        return super.run(params).then(() => {
            this.__view("errorPage")
                .set("error", params.error)
                .set("locations", this.__component("@router").history())
            ;
        });
    }
}

export default Error;
