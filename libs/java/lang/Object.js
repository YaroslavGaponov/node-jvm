/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");

var Object = module.exports = function() {
    if (this instanceof Object) {
        this._hashCode = null;
    } else {
        return new Object();
    }
}

Object.getClassName = function() {
    return "java/lang/Object";
}
 

Object.prototype["<init>"] = function() {
    return this;
}

Object.prototype["toString"] = function() {
    return this.getClassName() + "@" +  this.hashCode().toString(16);
}

Object.prototype["hashCode"] = function() {
    if (!this._hashCode) {
        this._hashCode = Math.floor(Math.random() * 0xffffffff);
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