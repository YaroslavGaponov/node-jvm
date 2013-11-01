/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");

var NullPointerException = module.exports = function() {
    if (this instanceof NullPointerException) {
        Error.captureStackTrace(this, NullPointerException);
        this.message = null;
    } else {
        return new NullPointerException();
    }
}

util.inherits(NullPointerException, Error);

NullPointerException.getClassName = function() {
    return "java/lang/NullPointerException";    
}

NullPointerException.prototype["<init>"] = function(message) {
    this.message = message;
}

NullPointerException.prototype.toString = function() {
    return util.format("Exception %s: %s", NullPointerException.getClassName(), this.message);
}

