import Widget from "Tiie/Widgets/Widget";

import template from "./resources/template.html"

const cn = "FineUploader";

class FineUploader extends Widget {
    constructor(params = {}) {
        super(`<form></form>`);

        let p = this.__private(cn, {
            uploader : null
        });

        this.set("-value", params.value === undefined ? [] : params.value);
        this.set("-url", params.url === undefined ? null : params.url);

        // Plugin wymaga aby w DOMIE znalazł się szablon.
        if(this.__component("@app").target().find("#qq-template").length == 0) {
            // this.__component("@app").target().append(template);
            this.__component("@app").target().append(this.__template(template)(locations.pl));
        }

        // Prepare
        p.uploader = new qq.FineUploader({
            // debug: true,
            // inputName : "file",
            // core : {
            //     inputName : "file",
            // },
            // filenameParam : "file",
            element: this.element().get(0),
            request: {
                endpoint: this.get("url"),
            },
            callbacks : {
                onComplete : (id, name, response) => {
                    let value = this.get("value");
                    value.push(response);
                    this.set("value", value, {ommit : this.id()});
                }
            }
            // deleteFile: {
            //     enabled: true,
            //     url: "/uploads"
            // },
            // retry: {
            //    enableAuto: true
            // }
        });

        p.uploader.addInitialFiles(this.get("value"));

        // p.uploader.on("success", (file) => {
        //     file = JSON.parse(file.xhr.responseText);
        //     let value = this.get("value");

        //     value.push(file);

        //     this.set("value", value);
        // });

        // this.on("value", () => {
        //     this.reload();
        // }, this.id());

    }
}

const locations = {
    pl : {
        dropFilesHere : "Przeciągnij i upuść",
        uploadFile : "Wybierz plik",
        retry : "Ponów",
        editFileName : "Edytuj nazwę",
        deleteFile : "Usuń",
        pause : "Zatrzymaj",
        continue : "Kontynuuj",
    },
};

export default FineUploader;
