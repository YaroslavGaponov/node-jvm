/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var RuntimeException = require("./RuntimeException.js");

var ClassCastException = module.exports = function() {
    if (this instanceof ClassCastException) {
        RuntimeException.call(this);
    } else {
        return new ClassCastException();
    }
}

util.inherits(ClassCastException, RuntimeException);

ClassCastException.getClassName = function() {
    return "java/lang/ClassCastException";    
}

