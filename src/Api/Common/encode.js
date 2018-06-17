function urlencoded(data, base = "", init = true) {
    let encoded = [];

    for(let i in data){
        let v = data[i];

        if(typeof v == 'string' || typeof v == 'number'){
            if(init){
                encoded.push(`${i}=${v}`);
            }else{
                encoded.push(`${base}[${i}]=${v}`);
            }
        }else{
            if(init){
                encoded = encoded.concat(urlencoded(v, `${i}`, false));
            }else{
                encoded = encoded.concat(urlencoded(v, `${base}[${i}]`, false));
            }
        }
    }

    if(init){
        if (encoded.length) {
            return encodeURI(encoded.join('&'));
        }else{
            return null;
        }
    }else{
        return encoded;
    }
};

export default function(format, data) {
    switch (format) {
        case 'application/x-www-form-urlencoded':
            return urlencoded(data);
        case 'application/json':
            return JSON.stringify(data);
    }
}
