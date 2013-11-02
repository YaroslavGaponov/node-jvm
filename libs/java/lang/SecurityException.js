/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var RuntimeException = require("./RuntimeException.js");

var SecurityException = module.exports = function() {
    if (this instanceof SecurityException) {
        RuntimeException.call(this);
    } else {
        return new SecurityException();
    }
}

util.inherits(SecurityException, RuntimeException);

SecurityException.getClassName = function() {
    return "java/lang/SecurityException";    
}

