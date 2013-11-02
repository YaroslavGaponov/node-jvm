/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var Exception = require("./Exception.js");

var IlligalAccessException = module.exports = function() {
    if (this instanceof Exception) {
        Exception.call(this);
    } else {
        return new IlligalAccessException();
    }
}

util.inherits(IlligalAccessException, Exception);

IlligalAccessException.getClassName = function() {
    return "java/lang/IlligalAccessException";    
}


