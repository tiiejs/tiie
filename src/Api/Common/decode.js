function decode(format, raw) {
    switch (format) {
        case "text/html" :
        case "plain/text" :
            return raw;
        case 'application/json':
            if (raw === "") {
                return {};
            }

            raw = ''+raw+'';

            raw = raw
                .replace(/\n/g, "\\n")
                // .replace(/\\'/g, "\\'")
                // .replace(/\\"/g, '\\"')
                // .replace(/\\&/g, "\\&")
                // .replace(/\\r/g, "\\r")
                // .replace(/\\t/g, "\\t")
                // .replace(/\\b/g, "\\b")
                // .replace(/\\f/g, "\\f")
            ;

            try{
                raw = JSON.parse(raw);
            }catch(e){
                return false;
            }

            return raw;
    }

    throw('Unsuported params');
}

export default decode;
