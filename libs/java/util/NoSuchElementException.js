/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var RuntimeException = require("./RuntimeException.js");

var NoSuchMethodException = module.exports = function() {
    if (this instanceof NoSuchMethodException) {
        RuntimeException.call(this);
    } else {
        return new NoSuchMethodException();
    }
}

util.inherits(NoSuchMethodException, RuntimeException);

NoSuchMethodException.getClassName = function() {
    return "java/lang/NoSuchMethodException";    
}

