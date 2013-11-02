/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var Exception = require("./Exception.js");

var InterruptedException = module.exports = function() {
    if (this instanceof Exception) {
        Exception.call(this);
    } else {
        return new InterruptedException();
    }
}

util.inherits(InterruptedException, Exception);

InterruptedException.getClassName = function() {
    return "java/lang/InterruptedException";    
}


