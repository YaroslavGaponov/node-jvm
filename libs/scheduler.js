/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var MODE = {
    NORMAL: 0,
    SYNC: 1,
    ASYNC: 2,
    YIELD: 3
}

var Scheduler = module.exports = function(mticks) {
    if (this instanceof Scheduler) {
        this._ticks = 0;
        this._mode = MODE.NORMAL;
    } else {
        return new Scheduler(mticks);
    }
}

Scheduler.prototype.tick = function(pid, fn) {
    switch(this._mode) {
        case MODE.SYNC:
            fn();
            break;
        case MODE.YIELD:
            this._mode = MODE.NORMAL;
        case MODE.ASYNC:
            this._ticks = 0;
            (setImmediate || process.nextTick)(fn);
            break;
        case MODE.NORMAL:
            if (++ this._ticks > THREADS.getThread(pid).getPriority()) {
                this._ticks = 0;
                (setImmediate || process.nextTick)(fn);
            } else {
                fn();
            }
            break;
    }
}

Scheduler.prototype.yield = function() {
    this._mode = MODE.YIELD;
}

Scheduler.prototype.sync = function(fn) {
    this._mode = MODE.SYNC;
    fn();
    this._mode = MODE.NORMAL;
}

Scheduler.prototype.async = function(fn) {
    this._mode = MODE.ASYNC;
    fn();
    this._mode = MODE.NORMAL;
}
