/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var IndexOutOfBoundsException = require("./IndexOutOfBoundsException.js");

var ArrayIndexOutOfBoundsException = module.exports = function() {
    if (this instanceof IndexOutOfBoundsException) {
        IndexOutOfBoundsException.call(this);
    } else {
        return new ArrayIndexOutOfBoundsException();
    }
}

util.inherits(ArrayIndexOutOfBoundsException, IndexOutOfBoundsException);

ArrayIndexOutOfBoundsException.getClassName = function() {
    return "java/lang/ArrayIndexOutOfBoundsException";    
}


