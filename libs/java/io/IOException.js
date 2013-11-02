/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var Exception = require("../lang/Exception.js");

var IOException = module.exports = function() {
    if (this instanceof Exception) {
        Exception.call(this);
    } else {
        return new IOException();
    }
}

util.inherits(IOException, Exception);

IOException.getClassName = function() {
    return "java/io/IOException";    
}


