/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");

var ArrayIndexOutOfBoundsException = module.exports = function() {
    if (this instanceof ArrayIndexOutOfBoundsException) {
        Error.captureStackTrace(this, ArrayIndexOutOfBoundsException);
        this.message = null;
    } else {
        return new ArrayIndexOutOfBoundsException();
    }
}

util.inherits(ArrayIndexOutOfBoundsException, Error);

ArrayIndexOutOfBoundsException.getClassName = function() {
    return "java/lang/ArrayIndexOutOfBoundsException";    
}

ArrayIndexOutOfBoundsException.prototype["<init>"] = function(message) {
    this.message = message;
}

ArrayIndexOutOfBoundsException.prototype.toString = function() {
    return util.format("Exception %s: %s", ArrayIndexOutOfBoundsException.getClassName(), this.message);
}

