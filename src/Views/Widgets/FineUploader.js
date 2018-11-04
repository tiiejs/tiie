import Widget from 'Topi/Views/Widgets/Widget';
import template from 'Topi/Views/Widgets/FineUploader.template.html';

const cn = 'FineUploader';
class FineUploader extends Widget {
    constructor(params = {}) {
        super(`<form></form>`);

        let p = this.__private(cn, {
            uploader : null
        });

        this.set('-value', params.value === undefined ? [] : params.value);
        this.set('-url', params.url === undefined ? null : params.url);

        // Plugin wymaga aby w DOMIE znalazł się szablon.
        this.component('@app').target().append(template);

        // Prepare
        p.uploader = new qq.FineUploader({
            // debug: true,
            // inputName : 'file',
            // core : {
            //     inputName : 'file',
            // },
            // filenameParam : 'file',
            element: this.element().get(0),
            request: {
                endpoint: this.get('url'),
            },
            callbacks : {
                onComplete : (id, name, response) => {
                    let value = this.get('value');
                    value.push(response);
                    this.set('value', value, {ommit : this.id()});
                }
            }
            // deleteFile: {
            //     enabled: true,
            //     url: '/uploads'
            // },
            // retry: {
            //    enableAuto: true
            // }
        });

        p.uploader.addInitialFiles(this.get('value'));
        // p.uploader.on('success', (file) => {
        //     file = JSON.parse(file.xhr.responseText);
        //     let value = this.get('value');

        //     value.push(file);

        //     this.set('value', value);
        // });

        // this.on('value', () => {
        //     this.reload();
        // }, this.id());

    }

    render() {
        super.render();

        let p = this.__private(cn),
            value = this.get('&value')
        ;
    }
}

export default FineUploader;
