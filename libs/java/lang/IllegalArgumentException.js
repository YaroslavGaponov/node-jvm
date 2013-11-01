/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");

var IllegalArgumentException = module.exports = function() {
    if (this instanceof IllegalArgumentException) {
        Error.captureStackTrace(this, IllegalArgumentException);
        this.message = null;
    } else {
        return new IllegalArgumentException();
    }
}

util.inherits(IllegalArgumentException, Error);

IllegalArgumentException.getClassName = function() {
    return "java/lang/IllegalArgumentException";    
}

IllegalArgumentException.prototype["<init>"] = function(message) {
    this.message = message;
}

IllegalArgumentException.prototype.toString = function() {
    return util.format("Exception %s: %s", IllegalArgumentException.getClassName(), this.message);
}

