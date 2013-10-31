/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var Object = require("./Object.js");

var String = module.exports = function(s) {
    if (this instanceof String) {
        this._str = s;
    } else {
        return new String(s);
    }
}

util.inherits(String, Object);

String.getClassName = function() {
    return "java/lang/String";
}
 
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