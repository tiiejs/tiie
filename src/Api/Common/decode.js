function decode(format, raw) {
    let contentType = null;
    const splited = format.split(';');

    if (splited.length > 1) {
        contentType = splited[0];
    }else{
        contentType = splited[0];
    }

    // todo Create supports for other formats and charset

    switch (contentType) {
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
