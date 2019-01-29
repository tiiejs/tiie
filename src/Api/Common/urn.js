import encode from 'Tiie/Api/Common/encode';

function urn(url, params = {}, binds = {}, format = 'application/x-www-form-urlencoded'){
    // change binds
    for(let i in binds){
        url = url.replace(`{${i}}`, binds[i]);
    }

    let query = encode(format, params);

    if (query != null) {
        url += '?' + query;
    }

    return url;
}

export default urn;
