/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var Scheduler = module.exports = function(mticks) {
    if (this instanceof Scheduler) {
        this._mticks = mticks || 50;
        this._ticks = 0;
    } else {
        return new Scheduler(mticks);
    }
}

Scheduler.prototype.setMaxTicks = function(mticks) {
    this._mticks = mticks;
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
    this._ticks = this._mticks;
}

Scheduler.prototype.sync = function(fn) {
    var mticks = this._mticks;
    this._ticks = 0;
    this._mticks = Number.MAX_VALUE;
    fn();
    this._mticks = mticks;
}

Scheduler.prototype.async = function(fn) {
    var mticks = this._mticks;
    this._mticks = this._ticks = 0;
    fn();
    this._mticks = mticks;
}