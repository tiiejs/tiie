import View from 'Tiie/View';
import Action from 'Tiie/Action';
import ApiResponse from 'Tiie/Api/Response';

import templateLayout from './resources/layout.html';

const cn = 'Error';
class Error extends Action {

    async run(params, controller) {
        let p = this.__private(cn);

        this.view(templateLayout);

        return super.run(params, controller).then(() => {
            if (params.error instanceof ApiResponse) {
                let httpCodes = {
                    '400' : 'Bad Request',
                    '401' : 'Unauthorized',
                    '402' : 'Payment Required',
                    '403' : 'Forbidden',
                    '404' : 'Not Found',
                    '405' : 'Method Not Allowed',
                    '406' : 'Not Acceptable',
                    '407' : 'Proxy Authentication Required',
                    '408' : 'Request Timeout',
                    '409' : 'Conflict',
                    '410' : 'Gone',
                    '411' : 'Length Required',
                    '412' : 'Precondition Failed',
                    '413' : 'Payload Too Large',
                    '414' : 'Request-URI Too Long',
                    '415' : 'Unsupported Media Type',
                    '416' : 'Requested Range Not Satisfiable',
                    '417' : 'Expectation Failed',
                    '421' : 'Misdirected Request',
                    '422' : 'Unprocessable Entity',
                    '423' : 'Locked',
                    '424' : 'Failed Dependency',
                    '426' : 'Upgrade Required',
                    '428' : 'Precondition Required',
                    '429' : 'Too Many Requests',
                    '431' : 'Request Header Fields Too Large',
                    '444' : 'Connection Closed Without Response',
                    '451' : 'Unavailable For Legal Reasons',
                    '499' : 'Client Closed Request',
                };

                let error = "Nieznany typ błędu";

                if (httpCodes[params.error.status()] != undefined) {
                    error = httpCodes[params.error.status()];
                }

                this.view().element("error").html(error);
            }else if(typeof params.error == "string"){
                this.view().element("error").html(params.error);
            }else{
                this.view().element("error").html("Nieznany typ błędu.");
            }
        });
    }
}

export default Error;
