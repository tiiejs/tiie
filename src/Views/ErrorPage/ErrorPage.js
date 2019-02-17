import View from "Tiie/View";
import ApiResponse from 'Tiie/Api/Response';

import templateLayout from './resources/layout.html';
import templateContent from './resources/content.html';
import style from './resources/style.scss';

const cn = "ErrorPage";

class ErrorPage extends View {
    constructor(data = {}) {
        super(templateLayout);

        let p = this.__private(cn, {});

        this.__define("data.structure", {
            locations : {type : 'array', default : [], notNull : 1},
        });

        this.set(data, {silently : 1, defined : 1});
        this.set("-error", data.error);

        // Events
        this.on([
            "error",
            "locations",
        ], () => {
            this.render();
        }, this.id());
    }

    render() {
        let p = this.__private(cn),
            data = {},
            error = this.get("&error")
        ;

        if (error instanceof ApiResponse) {
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

            data.error = "Nieznany typ błędu";

            if (httpCodes[error.status()] != undefined) {
                data.error = httpCodes[error.status()];
            }

        }else if(typeof error == "string"){
            data.error = error;
        } else {
            data.error = "Nieznany typ błędu.";
        }

        data.locations = this.get("locations").reverse();

        this.__content("content", templateContent, data);

        return this;
    }
}

export default ErrorPage;
