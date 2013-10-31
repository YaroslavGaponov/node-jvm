/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var Object = require("./Object.js");

var StringBuilder = module.exports = function(p) {
    if (this instanceof StringBuilder) {
        if (typeof p === "number") {
            this._buf = new Array(p).join(' ');
        } else {
            this._buf = p || "";
        }
    } else {
        return new StringBuilder(p);
    }
}

util.inherits(StringBuilder, Object);

StringBuilder.getClassName = function() {
    return "java/lang/StringBuilder";
}
 

StringBuilder.prototype["<init>"] = function() {
    for(var i=0; i<arguments.length; i++) {
        this._buf += arguments[i].toString();
    }
    return this;
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