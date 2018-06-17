import TopiObject from 'Topi/Object';

const cn = 'Response';
class Response extends TopiObject {
    constructor(xhr, request, params = {}) {
        super();

        let p = this.private(cn, {
            successHttpCodes : params.successHttpCodes === undefined ? [200, 201] : params.successHttpCodes,
            status : params.status === undefined ? null : params.status,
            data : params.data === undefined ? {} : params.data,
            xhr,
            request,
        });
    }

    error() {
        let p = this.private(cn);

        if (p.successHttpCodes.indexOf(this.status()) === -1) {
            return true;
        }

        return false;
    }

    status(status) {
        return this.private(cn, 'status', status);
    }

    data(name) {
        let p = this.private(cn);

        switch (arguments.length) {
            case 0:
                return p.data;
            case 1:
                return p.data[name];
        }

        throw('Unsuported params');
    }

    name() {
        return this.private(cn, 'request').name();
    }

    xhr() {
        return this.private(cn, 'xhr');
    }

    header(name) {
        return this.private(cn, 'xhr').getResponseHeader(name);
    }

    name() {
        return this.private(cn, 'request').name();
    }
}

export default Response;
