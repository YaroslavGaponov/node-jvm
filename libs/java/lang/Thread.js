var util = require("util");
var Object = require("./Object.js");
var Frame = require("./../../frame.js");

var STATE = {
    NEW: "NEW",
    RUNNABLE: "RUNNABLE",
    BLOCKED: "BLOCKED",
    WAITING: "WAITING",
    TIMED_WAITING: "TIMED_WAITING",
    TERMINATED: "TERMINATED"
};

var Thread = module.exports = function() {
    if (this instanceof Thread) {
        this._instance = null;
        this._state = STATE.NEW;
    } else {
        return new Thread();
    }
}

util.inherits(String, Object);

Thread.prototype["<init>"] = function(instance) {
    this._instance = instance;
    this._state = STATE.NEW;
    return this;
}

Thread.prototype["join"] = function() {
    process.threads++;
}

Thread.prototype["start"] = function() {
    var self = this;
    this._state = STATE.RUNNABLE;
    if (this._instance["run"] instanceof Frame) {
        this._instance["run"].run.call(this._instance["run"], [this._instance], function() {
            self._state = STATE.TERMINATED;
            process.threads--;
        });
    } else {
        process.nextTick(function() {
            self._instance["run"].apply(self._instance);
            self._state = STATE.TERMINATED;
            process.threads--;
        });
    }
};

