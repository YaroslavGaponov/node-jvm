/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var Threads = module.exports = function() {
    this.threads = {};
    this.counter = 0;
}

Threads.prototype.add = function(thread) {
    var pid = this.counter++;
    this.threads[pid] = thread;
    return pid;
}

Threads.prototype.remove = function(pid) {
    delete this.threads[pid];
}

Threads.prototype.count = function() {
    return Object.keys(this.threads).length;
}

Threads.prototype.getThread = function(pid) {
    return this.threads[pid];
}



