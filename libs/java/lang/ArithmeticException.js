/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var RuntimeException = require("./RuntimeException.js");

var ArithmeticException = module.exports = function() {
    if (this instanceof ArithmeticException) {
        RuntimeException.call(this);
    } else {
        return new ArithmeticException();
    }
}

util.inherits(ArithmeticException, RuntimeException);

ArithmeticException.getClassName = function() {
    return "java/lang/ArithmeticException";    
}

