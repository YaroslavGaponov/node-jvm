/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var Exception = require("./Exception.js");

var NoSuchMethodException = module.exports = function() {
    if (this instanceof Exception) {
        Exception.call(this);
    } else {
        return new NoSuchMethodException();
    }
}

util.inherits(NoSuchMethodException, Exception);

NoSuchMethodException.getClassName = function() {
    return "java/lang/NoSuchMethodException";    
}


