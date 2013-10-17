
var util = require("util");

var Object = module.exports = function() {
    if (this instanceof Object) {
        this._className = "java.lang.Object";
        this._hashCode = null;
    } else {
        return new Object();
    }
}

Object.prototype["<init>"] = function() {
    return this;
}

Object.prototype["toString"] = function() {
    return util.format("%s@%s", this._className, this.hashCode());
}

Object.prototype["hashCode"] = function() {
    if (!this._hashCode) {
        this._hashCode = Math.floor(Math.random()*65535);
    }
    return this._hashCode;
}

Object.prototype["equals"] = function() {
    return this === arguments[0];
}

Object.prototype["clone"] = function() {
    var o = {};
    for(var name in this) {
        o[name] = this[name];
    }
    return o;
}