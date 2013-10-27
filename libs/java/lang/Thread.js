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

Thread.prototype.done = function() {
    this._state = STATE.TERMINATED;
}


Thread.prototype["start"] = function() {
    this._state = STATE.RUNNABLE;
    if (this._instance["run"] instanceof Frame) {
        this._instance["run"].runAsync.apply(this._instance["run"], [this.done, this._instance]);
    } else {
        this._instance["run"].apply(this._instance);
    }
};

