/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var Exception = require("./Exception.js");

var RuntimeException = module.exports = function() {
    if (this instanceof Exception) {
        Exception.call(this);
    } else {
        return new RuntimeException();
    }
}

util.inherits(RuntimeException, Exception);

RuntimeException.getClassName = function() {
    return "java/lang/RuntimeException";    
}


