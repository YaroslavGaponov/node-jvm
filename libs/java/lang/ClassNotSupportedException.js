/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var Exception = require("./Exception.js");

var ClassNotSupportedException = module.exports = function() {
    if (this instanceof Exception) {
        Exception.call(this);
    } else {
        return new ClassNotSupportedException();
    }
}

util.inherits(ClassNotSupportedException, Exception);

ClassNotSupportedException.getClassName = function() {
    return "java/lang/ClassNotSupportedException";    
}


