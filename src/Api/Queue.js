import TiieObject from 'Tiie/Object';
import Responses from 'Tiie/Api/Responses';

const cn = 'Queue';
class Queue extends TiieObject {
    constructor(api) {
        super();

        let p = this.__private(cn, {
            api,
            requets : []
        });
    }

    request(creator) {
        let p = this.__private(cn);

        p.requets.push(p.api.request(creator));

        return this;
    }

    promise() {
        return new Promise((resolve, reject) => {
            this.exec(function(responses){
                if (responses.error()) {
                    reject(responses);
                }else{
                    resolve(responses);
                }
            });
        });
    }

    exec(complete) {
        let p = this.__private(cn),
            count = p.requets.length,
            responses = [],
            i
        ;

        let check = () => {
            if (count > 0) {
                return;
            }

            if (typeof complete == 'function') {
                complete(new Responses(responses));
            }
        }

        if (count > 0) {
            for (i in p.requets) {
                p.requets[i].exec(function(response){
                    responses.push(response);
                    count--;
                    check();
                });
            }

        }else{
            check();
        }
    }
}

export default Queue;
