/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var Exception = require("./Exception.js");

var InstantiationException = module.exports = function() {
    if (this instanceof Exception) {
        Exception.call(this);
    } else {
        return new InstantiationException();
    }
}

util.inherits(InstantiationException, Exception);

InstantiationException.getClassName = function() {
    return "java/lang/InstantiationException";    
}


