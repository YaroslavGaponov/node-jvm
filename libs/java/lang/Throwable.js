/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");

var Throwable = module.exports = function() {
    if (this instanceof Throwable) {
        this.message = "";
        this.cause = null;
    } else {
        return new Throwable();
    }
}

util.inherits(Throwable, Error);

Throwable.getClassName = function() {
    return "java/lang/Throwable";    
}

Throwable.prototype["<init>"] = function() {
    switch(arguments.length) {
        case 1:
            if (typeof arguments[0] === "string") {
                this.message = arguments[0];
            } else {
                this.cause = arguments[0];
            }
            break;
        case 2:
            this.message = argument[0];
            this.cause = argument[1];
            break;
    }
}

Throwable.prototype.initCause = function(cause) {
    this.cause = cause;
}

Throwable.prototype.getMessage = function() {
    return this.message;
}

Throwable.prototype.getCause = function() {
    return this.cause;
}

Throwable.prototype.toString = function() {
    return util.format("Exception %s: %s", this.getClassName(), this.message);
}

