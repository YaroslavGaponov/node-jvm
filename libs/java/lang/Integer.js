
var Integer = module.exports = function() {
    if (this instanceof Integer) {
    } else {
        return new Integer();
    }
}

Integer["parseInt"] = function() {
    return parseInt.apply(null, arguments);
}

Integer["valueOf"] = function() {
    if (arguments.length === 0) return "0";
    return arguments[0].toString();
}

