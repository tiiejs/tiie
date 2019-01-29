import TiieObject from 'Tiie/Object';

const cn = 'Endpoint';
class Endpoint extends TiieObject {
    constructor(api, urn) {
        super();

        let p = this.__private(cn, {
            api,
            urn,
        });
    }

    uri() {
        let p = this.__private(cn);

        return `${p.api.url()}${p.urn}`;
    }

    request(creator) {
        let p = this.__private(cn);

        let request = p.api.request();

        request.urn(p.urn);

        if (creator) creator.call(request, request);

        return request;
    }
}

export default Endpoint;
