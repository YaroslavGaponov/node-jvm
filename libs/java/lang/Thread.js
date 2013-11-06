/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var Object = require("./Object.js");
var Frame = require("./../../frame.js");
var Threads = require("./../../threads.js");

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


Thread.getClassName = function() {
    return "java/lang/Thread";
}
 
Thread.prototype["<init>"] = function(instance) {
    this._instance = instance;
    this._state = STATE.NEW;
    this._id = THREADS.add();
    return this;
}

Thread.prototype["join"] = function() {
    THREADS.join(this._id );
}

Thread.prototype["start"] = function() {
    var self = this;
    this._state = STATE.RUNNABLE;
    if (this._instance["run"] instanceof Frame) {
        this._instance["run"].run([this._instance], function() {
            self._state = STATE.TERMINATED;
            THREADS.remove(self._id);
        });
    } else {
        self._instance["run"]();
        self._state = STATE.TERMINATED;
        if (self._join) {
            THREADS.remove(self._id);
        }
    }
};

