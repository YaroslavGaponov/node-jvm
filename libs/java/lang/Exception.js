/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var Throwable = require("./Throwable.js");

var Exception = module.exports = function() {
    if (this instanceof Exception) {
        Throwable.call(this);
    } else {
        return new Exception();
    }
}

util.inherits(Exception, Throwable);

Exception.getClassName = function() {
    return "java/lang/Exception";    
}

