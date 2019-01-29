import TiieObject from 'Tiie/Object';
import Response from 'Tiie/Api/Response';
import Responses from 'Tiie/Api/Responses';

import encode from 'Tiie/Api/Common/encode';
import decode from 'Tiie/Api/Common/decode';
import urnencoder from 'Tiie/Api/Common/urn';

const cn = 'Request';
class Request extends TiieObject {
    constructor(api){
        super();

        let p = this.__private(cn, {
            api,
            name : null,
            title : null,
            description : null,
            resourceId : null,
            urn : null,
            method : 'get',
            binds : {},
            data : {},
            params : {},
            contentType : {},
            requests : [],
            headers : {},

            // queue,
            timeout : null,

            // events : new Events(this),
            next : null,

            control : function(request, response, next){
                next(response);
            },

            prepare : function(request, responses, next){
                next();
            },
        });
    }

    title(title) {
        return this.__private(cn, 'title', title);
    }

    name(name) {
        return this.__private(cn, 'name', name);
    }

    resourceId(resourceId) {
        return this.__private(cn, 'resourceId', resourceId);
    }

    description(description) {
        return this.__private(cn, 'description', description);
    }

    timeout(timeout) {
        return this.__private(cn, 'timeout', timeout);
    }

    urn(urn) {
        let p = this.__private(cn);

        if (urn === undefined) {
            return p.urn === undefined ? null : p.urn;
        }else{
            p.urn = urn;

            return this;
        }

        this.log("Unsuported params.", "warn");
    }

    method(method) {
        return this.__private(cn, 'method', method);
    }

    control(control) {
        return this.__private(cn, 'control', control);
    }

    prepare(prepare) {
        return this.__private(cn, 'prepare', prepare);
    }

    header(name, value) {
        let p = this.__private(cn);

        if (arguments.length === 1) {
            return p.headers[name];
        }else{
            p.headers[name] = value;

            return this;
        }
    }

    headers(headers) {
        let p = this.__private(cn);

        if (arguments.length == 1) {
            return p.headers = headers;
        }else{
            return p.headers;
        }
    }

    data(name, value) {
        let p = this.__private(cn);

        switch (arguments.length) {
            case 0:
                return p.data;
            case 1:
                if (typeof name == 'string') {
                    return p.data[name];
                }else if(typeof name == 'object') {
                    p.data = name;

                    return this
                }

            case 2:
                p.data[name] = value;

                return this;
        }

        throw('Unsuported params');
    }

    param(name, value) {
        let p = this.__private(cn);

        switch (arguments.length) {
            case 1:
                return p.params[name];
            case 2:
                p.params[name] = value;

                return this;
        }

        throw('Unsuported params');
    }

    params(params) {
        let p = this.__private(cn);

        switch (arguments.length) {
            case 0:
                return p.params;
            case 1:
                p.params = params;

                return this;
        }

        throw('Unsuported params');
    }

    bind(name, value) {
        let p = this.__private(cn);

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
        let p = this.__private(cn);

        switch (arguments.length) {
            case 0:
                return p.binds;
            case 1:
                p.binds = binds;

                return this;
        }

        throw('Unsuported params');
    }

    request(creator) {
        let p = this.__private(cn),
            request = p.api.request(creator)
        ;

        p.requests.push(request);

        return request;
    }

    /**
     * Exec request and return Promise object.
     */
    promise() {
        return new Promise((resolve, reject) => {
            this.exec((response) => {
                if (response.error()) {
                    reject(response);
                }else{
                    resolve(response);
                }
            });
        });
    }

    exec(complete) {
        let p = this.__private(cn),
            count = p.requests.length,
            responses = [],
            i
        ;

        let check = () => {
            if (count > 0) {
                return;
            }

            p.prepare.call(this, this, new Responses(responses), () => {
                this._xhr((response) => {
                    p.control.call(this, this, response, (response) => {
                        // user response
                        if (typeof complete == 'function') {
                            complete(response);
                        }
                    });
                });
            });
        }

        if (count > 0) {
            // request has dependences, i go throught dependences and call
            for (i in p.requests) {
                p.requests[i].exec((response) => {
                    responses.push(response);
                    count--;
                    check();
                });
            }
        }else{
            check();
        }
    }

    _xhr(complete) {
        let p = this.__private(cn),
            type = this.header('Content-Type'),
            ended = false,
            timeout = this.timeout(),
            urn = urnencoder(this.urn(), this.params(), this.binds()),
            url = p.api.url(),
            uri = `${url}${urn}`
        ;

        let resourceId = this.resourceId();

        if (resourceId != null) {
            uri = `${uri}/${resourceId}`;
        }

        if (type === undefined) {
            throw("Please define header Content-Type for request.");
        }

        let data = encode(type, this.data()),
            xhr = new XMLHttpRequest()
        ;

        // xhr.onloadstart = function(){

        // }

        let end = (iserror, error) => {
            if (ended) {
                return;
            }

            ended = true;

            let params = {};

            if (iserror) {
                params.status = error;
            }else{
                params.status = xhr.status;

                let data = decode(xhr.getResponseHeader('Content-Type'), xhr.responseText);

                if (data === false) {
                    params.status = "unread";
                }else{
                    params.data = data;
                }
            }

            complete(new Response(xhr, this, params));
        }

        xhr.onload = function () {
            end(false);
        };

        xhr.onloadend = function() {
            end(false);
        }

        xhr.ontimeout = function() {
            end(true, "timeout");
        }

        xhr.onabort = function() {
            end(true, "abort");
        }

        xhr.onerror = function() {
            end(true, "error");
        }

        xhr.open(this.method(), uri, true);

        for (let header in p.headers) {
            xhr.setRequestHeader(header, p.headers[header]);
        }

        if (timeout != null) {
            setTimeout(function() {
                end(true, "timeout");
            }, timeout);
        }

        xhr.send(data);
    }
}

export default Request;
