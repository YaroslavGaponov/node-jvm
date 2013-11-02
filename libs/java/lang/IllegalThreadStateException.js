/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var RuntimeException = require("./RuntimeException.js");

var IllegalThreadStateException = module.exports = function() {
    if (this instanceof IllegalThreadStateException) {
        IllegalArgumentException.call(this);
    } else {
        return new IllegalThreadStateException();
    }
}

util.inherits(IllegalThreadStateException, IllegalArgumentException);

IllegalThreadStateException.getClassName = function() {
    return "java/lang/IllegalThreadStateException";    
}


