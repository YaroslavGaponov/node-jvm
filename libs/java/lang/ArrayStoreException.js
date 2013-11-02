/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var RuntimeException = require("./RuntimeException.js");

var ArrayStoreException = module.exports = function() {
    if (this instanceof ArrayStoreException) {
        RuntimeException.call(this);
    } else {
        return new ArrayStoreException();
    }
}

util.inherits(ArrayStoreException, RuntimeException);

ArrayStoreException.getClassName = function() {
    return "java/lang/ArrayStoreException";    
}

