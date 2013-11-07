/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");

var LEVELS = {
    DEBUG: 1<<0,
    ERROR: 1<<1,
    INFO: 1<<2,
    check: function(levels, level) {
        return (levels & level) === level;
    }
};

var Logger = module.exports = function(level) {
    if (this instanceof Logger) {
        this.level = level || ( LEVELS.DEBUG | LEVELS.ERROR | LEVELS.INFO );
    } else {
        return new Logger(level);
    }
}

Logger.prototype.setLogLevel = function(level) {
    this.level = level;
}

Logger.prototype.debug = function(msg) {
    if (LEVELS.check(this.level, LEVELS.DEBUG)) {
        util.debug(msg);
    }
}

Logger.prototype.error = function(msg) {
    if (LEVELS.check(this.level, LEVELS.ERROR)) {
        util.error(msg);
    }
}

Logger.prototype.info = function(msg) {
    if (LEVELS.check(this.level, LEVELS.PRINT)) {
        util.print("INFO: " + msg);
    }
}