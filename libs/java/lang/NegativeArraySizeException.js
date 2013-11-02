/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var RuntimeException = require("./RuntimeException.js");

var NegativeArraySizeException = module.exports = function() {
    if (this instanceof NegativeArraySizeException) {
        RuntimeException.call(this);
    } else {
        return new NegativeArraySizeException();
    }
}

util.inherits(NegativeArraySizeException, RuntimeException);

NegativeArraySizeException.getClassName = function() {
    return "java/lang/NegativeArraySizeException";    
}


