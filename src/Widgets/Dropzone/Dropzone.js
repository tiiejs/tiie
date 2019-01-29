import Widget from 'Tiie/Widgets/Widget';
import Dropzone from 'Tiie/dropzone';

const cn = 'Dropzone';
class Dropzone extends Widget {
    constructor(params = {}) {
        super(`<form class="dropzone"></form>`);

        let p = this.__private(cn, {
            dropzone : null
        });

        this.set('-value', params.value === undefined ? [] : params.value);
        this.set('-url', params.url === undefined ? null : params.url);

        // Prepare
        p.dropzone = new Dropzone(this.element().get(0), {
            url : this.get('url'),
            addRemoveLinks : 1,
            // previewsContainer : 1,
        });

        p.dropzone.on('success', (file) => {
            file = JSON.parse(file.xhr.responseText);
            let value = this.get('value');

            value.push(file);

            this.set('value', value);
        });

        this.on('value', () => {
            this.reload();
        }, this.id());

    }

    render() {
        super.render();

        let p = this.__private(cn),
            value = this.get('&value')
        ;

        p.dropzone.removeAllFiles();

        value.map((photo) => {
            return {
                name : photo.name,
                size : photo.size,
                path : photo.path,
            };
        }).forEach((file) => {
            // p.dropzone.options.addedfile.call(p.dropzone, file);
            // p.dropzone.options.thumbnail.call(p.dropzone, file, `http://localhost:8000/${file.path}`);
            // p.dropzone.addFile(file);
            p.dropzone.emit("addedfile", file);
            // p.dropzone.emit("thumbnail", file, `http://localhost:8000/${file.path}`);
            p.dropzone.options.thumbnail.call(p.dropzone, file, `http://localhost:8000/${file.path}`);
            p.dropzone.emit("complete", file);
            // myDropzone.emit("complete", existingFiles[i]);
        });

        //Add existing files into dropzone
        // var existingFiles = [
        //     { name: "Filename 1.pdf", size: 12345678 },
        //     { name: "Filename 2.pdf", size: 12345678 },
        //     { name: "Filename 3.pdf", size: 12345678 },
        //     { name: "Filename 4.pdf", size: 12345678 },
        //     { name: "Filename 5.pdf", size: 12345678 }
        // ];

        // for (i = 0; i < existingFiles.length; i++) {
        //     myDropzone.emit("addedfile", existingFiles[i]);
        //     // myDropzone.emit("thumbnail", existingFiles[i], "/image/url");
        //     myDropzone.emit("complete", existingFiles[i]);
        // }

    }
}

export default Dropzone;
