/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");

var Logger = module.exports = function() {
    if (this instanceof Logger) {     
    } else {
        return new Logger();
    }
}

Logger.prototype.debug = function(msg) {
    util.debug(msg);
}

Logger.prototype.error = function(msg) {
    util.error(msg);
}

Logger.prototype.print = function(msg) {
    util.print(msg);
}