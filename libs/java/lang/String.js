var util = require("util");
var Object = require("./Object.js");

var String = module.exports = function(s) {
    if (this instanceof StringBuilder) {
        this._str = s;
    } else {
        return new StringBuilder(s);
    }
}

util.inherits(String, Object);

String.prototype["<init>"] = function() {
    return this;
}

String.prototype["toString"] = function() {
    return this._str.toString();
}

String["valueOf"] = function() {
    if (arguments.length === 0) return "";
    return arguments[0].toString();
}