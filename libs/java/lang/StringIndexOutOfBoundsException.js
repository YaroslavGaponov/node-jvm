/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var RuntimeException = require("./RuntimeException.js");

var StringIndexOutOfBoundsException = module.exports = function() {
    if (this instanceof IndexOutOfBoundsException) {
        IndexOutOfBoundsException.call(this);
    } else {
        return new StringIndexOutOfBoundsException();
    }
}

util.inherits(StringIndexOutOfBoundsException, IndexOutOfBoundsException);

StringIndexOutOfBoundsException.getClassName = function() {
    return "java/lang/StringIndexOutOfBoundsException";    
}


