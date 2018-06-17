import TopiObject from 'Topi/Object';
import Request from 'Topi/Api/Request';
import Queue from 'Topi/Api/Queue';
import Endpoint from 'Topi/Api/Endpoint';

const cn = 'Api';

/**
 * Create requests and manages the
 *
 * api.request((request) => {
 *     request.urn('/offers');
 *     request.param('categoryId', 26);
 * }).exec((response) => {
 *
 * });
 *
 * api.queue((queue) => {
 *     queue.request((request) => {
 *         request.id('offers-1');
 *         request.urn('/offers');
 *         request.param('categoryId', 26);
 *     });
 *
 *     queue.request((request) => {
 *         request.id('offers-2');
 *         request.urn('/offers');
 *         request.param('categoryId', 26);
 *     });
 * }).exec((responses) => {
 * });
 *
 * api.request(function() {
 *     this.id('offers')
 *     this.urn('/offers');
 *     this.param('categoryId', 27);
 *
 *     this.request(function() {
 *         this.id('offers2')
 *         this.urn('/offers');
 *         this.param('categoryId', 26);
 *     });
 *
 *     // this.prepare(function(request, responses, done){
 *
 *     //     done();
 *     // });
 *
 * }).exec(function(response){
 * });
 */
class Api extends TopiObject {
    constructor(url = "") {
        super();

        let p = this.private(cn, {
            binds : {},
            url,
            headers : {
                'Content-Type' : 'application/json'
            },
        });
    }

    url() {
        return this.private(cn).url;
    }

    /**
     * Zwraca obiekt Endpoint wraz z ustawionym adrese
     *
     * @param {string} urn
     * @return Endpoint
     */
    endpoint(urn) {
        let p = this.private(cn);

        return new Endpoint(this, urn);
    }

    bind(name, value) {
        let p = this.private(cn);

        p.binds[name] = value;

        return this;
    }

    binds(binds) {
        let p = this.private(cn);

        p.binds = binds;

        return this;
    }

    header(name, value) {
        let p = this.private(cn);

        if (arguments.length === 1) {
            return p.headers[name];
        }else{
            p.headers[name] = value;

            return this;
        }
    }

    headers(headers) {
        let p = this.private(cn);

        if (arguments.length == 1) {
            return p.headers = headers;
        }else{
            return p.headers;
        }
    }

    bind(name, value) {
        let p = this.private(cn);

        switch (arguments.length) {
            case 1:
                return p.binds[name];
            case 2:
                p.binds[name] = value;

                return this;
        }

        throw('Unsuported params');
    }

    binds(binds) {
        let p = this.private(cn);

        switch (arguments.length) {
            case 0:
                return p.binds;
            case 1:
                p.binds = binds;

                return this;
        }

        throw('Unsuported params');
    }

    /**
     * Create request
     */
    queue(creator) {
        let queue = new Queue(this);

        creator.call(queue, queue);

        return queue;
    }

    request(creator) {
        let p = this.private(cn),
            request = new Request(this)
        ;

        request.headers(this.headers());
        request.binds(this.binds());

        if (creator) creator.call(request, request);

        return request;
    }
}

export default Api;
