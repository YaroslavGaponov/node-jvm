/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var RuntimeException = require("./RuntimeException.js");

var EmptyStackException.js = module.exports = function() {
    if (this instanceof EmptyStackException.js) {
        RuntimeException.call(this);
    } else {
        return new EmptyStackException.js();
    }
}

util.inherits(EmptyStackException.js, RuntimeException);

EmptyStackException.js.getClassName = function() {
    return "java/lang/EmptyStackException.js";    
}

