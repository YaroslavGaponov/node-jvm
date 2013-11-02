/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var RuntimeException = require("./RuntimeException.js");

var IndexOutOfBoundsException = module.exports = function() {
    if (this instanceof IndexOutOfBoundsException) {
        RuntimeException.call(this);
    } else {
        return new IndexOutOfBoundsException();
    }
}

util.inherits(IndexOutOfBoundsException, RuntimeException);

IndexOutOfBoundsException.getClassName = function() {
    return "java/lang/IndexOutOfBoundsException";    
}


