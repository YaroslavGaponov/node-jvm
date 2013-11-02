/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var RuntimeException = require("./RuntimeException.js");

var IllegalMonitorStateException = module.exports = function() {
    if (this instanceof IllegalMonitorStateException) {
        RuntimeException.call(this);
    } else {
        return new IllegalMonitorStateException();
    }
}

util.inherits(IllegalMonitorStateException, RuntimeException);

IllegalMonitorStateException.getClassName = function() {
    return "java/lang/IllegalMonitorStateException";    
}


