/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var RuntimeException = require("./RuntimeException.js");

var IllegalArgumentException = module.exports = function() {
    if (this instanceof IllegalArgumentException) {
        RuntimeException.call(this);
    } else {
        return new IllegalArgumentException();
    }
}

util.inherits(IllegalArgumentException, RuntimeException);

IllegalArgumentException.getClassName = function() {
    return "java/lang/IllegalArgumentException";    
}


