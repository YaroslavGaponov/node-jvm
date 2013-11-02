/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var Exception = require("./Exception.js");

var ClassNotFoundException = module.exports = function() {
    if (this instanceof Exception) {
        Exception.call(this);
    } else {
        return new ClassNotFoundException();
    }
}

util.inherits(ClassNotFoundException, Exception);

ClassNotFoundException.getClassName = function() {
    return "java/lang/ClassNotFoundException";    
}


