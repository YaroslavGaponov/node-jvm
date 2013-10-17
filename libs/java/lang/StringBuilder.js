
var StringBuilder = module.exports = function(str) {
    if (this instanceof StringBuilder) {
        this._buf = str || "";
    } else {
        return new StringBuilder(str);
    }
}

StringBuilder.prototype["<init>"] = function() {
    for(var i=0; i<arguments.length; i++) {
        this._buf += arguments[i].toString();
    }
}

StringBuilder.prototype["append"] = function() {
    for(var i=0; i<arguments.length; i++) {
        this._buf += arguments[i].toString();
    }
    return this;
}

StringBuilder.prototype["toString"] = function() {
    return this._buf.toString();
}