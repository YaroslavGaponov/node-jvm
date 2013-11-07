/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var Scheduler = module.exports = function(MAX_TICKS) {
    if (this instanceof Scheduler) {
        this._mticks = MAX_TICKS || 50;
        this._ticks = 0;
    } else {
        return new Scheduler(MAX_TICKS);
    }
}

Scheduler.prototype.tick = function(fn) {
    if (++ this._ticks > this._mticks) {
        this._ticks = 0;
        (setImmediate || process.nextTick)(fn);
    } else {
        fn();
    }
}

Scheduler.prototype.yield = function() {
    this._ticks = Number.MAX_VALUE;
}
