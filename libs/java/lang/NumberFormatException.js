/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var RuntimeException = require("./RuntimeException.js");

var NumberFormatException = module.exports = function() {
    if (this instanceof NumberFormatException) {
        IllegalArgumentException.call(this);
    } else {
        return new NumberFormatException();
    }
}

util.inherits(NumberFormatException, IllegalArgumentException);

NumberFormatException.getClassName = function() {
    return "java/lang/NumberFormatException";    
}


