/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");

var LEVELS = {
    DEBUG: 1 << 0,
    ERROR: 1 << 1,
    INFO: 1 << 2,
    WARN: 1 << 3,
    check: function (levels, level) {
        return (levels & level) === level;
    }
};

var LOG = Object.freeze({
    debug: console.debug || console.log,
    error: console.error || console.log,
    info: console.info || console.log,
    warn: console.warn || console.log
});

var Logger = module.exports = function (levels) {
    if (this instanceof Logger) {
        this.levels = levels || (LEVELS.DEBUG | LEVELS.ERROR | LEVELS.INFO | LEVELS.WARN);
    } else {
        return new Logger(levels);
    }
};

Logger.prototype.setLogLevel = function (levels) {
    this.levels = levels;
}

Logger.prototype.debug = function (msg) {
    if (LEVELS.check(this.levels, LEVELS.DEBUG)) {
        LOG.debug(msg);
    }
}

Logger.prototype.error = function (msg) {
    if (LEVELS.check(this.levels, LEVELS.ERROR)) {
        LOG.error(msg);
    }
}

Logger.prototype.info = function (msg) {
    if (LEVELS.check(this.levels, LEVELS.INFO)) {
        LOG.info("INFO: " + msg);
    }
}

Logger.prototype.warn = function (msg) {
    if (LEVELS.check(this.levels, LEVELS.WARN)) {
        LOG.warn("WARN: " + msg);
    }
}