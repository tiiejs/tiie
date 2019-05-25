import Action from "Tiie/Action";
import ViewErrorPage from "Tiie/Views/ErrorPage/ErrorPage";
import View from "Tiie/View";

import templateLayout from "./resources/layout.html";

const cn = 'Error';

class Error extends Action {
    async run(params = {}, controller) {
        let p = this.__private(cn),
            router = this.__component("@router")
        ;

        p.layout = new View(templateLayout);
        p.layout.target(controller.content());


        return super.run(params).then(() => {
            this.__view("errorPage", new ViewErrorPage({
                error : params.error,
                locations : router.history(),
            }));

            this.__view("errorPage")
                .target(p.layout.element())
                .on("events.goToLocation", (event, params) => {
                    let location = event.this.get("&locations").find(l => l.id == params.id);

                    router.redirect(location.urn);
                })
                .reload()
            ;
        });
    }
}

export default Error;
