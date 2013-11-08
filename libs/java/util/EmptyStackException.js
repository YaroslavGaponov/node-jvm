/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var RuntimeException = require("./RuntimeException.js");

var EmptyStackException = module.exports = function() {
    if (this instanceof EmptyStackException) {
        RuntimeException.call(this);
    } else {
        return new EmptyStackException();
    }
}

util.inherits(EmptyStackException, RuntimeException);

EmptyStackException.getClassName = function() {
    return "java/lang/EmptyStackException.js";    
}

