import TopiObject from 'Topi/Object';

const cn = 'Endpoint';
class Endpoint extends TopiObject {
    constructor(api, urn) {
        super();

        let p = this.private(cn, {
            api,
            urn,
        });
    }

    uri() {
        let p = this.private(cn);

        return `${p.api.url()}/${p.urn}`;
    }

    request(creator) {
        let p = this.private(cn);

        let request = p.api.request();

        request.urn(p.urn);

        if (creator) creator.call(request, request);

        return request;
    }
}

export default Endpoint;
