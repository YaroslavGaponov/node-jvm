/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");

var LEVELS = {
    DEBUG:  1<<0,
    ERROR:  1<<1,
    INFO:   1<<2,
    WARM:   1<<3,
    check: function(levels, level) {
        return (levels & level) === level;
    }
};

var Logger = module.exports = function(levels) {
    if (this instanceof Logger) {
        this.levels = levels || ( LEVELS.DEBUG | LEVELS.ERROR | LEVELS.INFO | LEVELS.WARM );
    } else {
        return new Logger(levels);
    }
}

Logger.prototype.setLogLevel = function(levels) {
    this.levels = levels;
}

Logger.prototype.debug = function(msg) {
    if (LEVELS.check(this.levels, LEVELS.DEBUG)) {
        util.debug(msg);
    }
}

Logger.prototype.error = function(msg) {
    if (LEVELS.check(this.levels, LEVELS.ERROR)) {
        util.error(msg);
    }
}

Logger.prototype.info = function(msg) {
    if (LEVELS.check(this.levels, LEVELS.INFO)) {
        util.print("INFO: " + msg);
    }
}

Logger.prototype.warn = function(msg) {
    if (LEVELS.check(this.levels, LEVELS.WARM)) {
        util.print("WARN: " + msg);
    }
}