const = {
    doT : require('dot')
};

module.exports = function(template, data){
    return doT.template(template)(data);
};
