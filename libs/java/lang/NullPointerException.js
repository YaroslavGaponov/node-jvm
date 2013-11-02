/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var RuntimeException = require("./RuntimeException.js");

var NullPointerException = module.exports = function() {
    if (this instanceof NullPointerException) {
       RuntimeException.call(this);
    } else {
        return new NullPointerException();
    }
}

util.inherits(NullPointerException, RuntimeException);

NullPointerException.getClassName = function() {
    return "java/lang/NullPointerException";    
}

