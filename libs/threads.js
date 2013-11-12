/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var Threads = module.exports = function() {
    this.threads = [];
    this.empty = [];
}

Threads.prototype.add = function(thread) {
    if (this.empty.length > 0) {
        var pid = this.empty.pop();
        this.threads[pid] = thread;
        return pid;
    } else {
        return this.threads.push(thread) - 1;
    }
}

Threads.prototype.remove = function(pid) {
    this.empty.push(pid);
    this.threads[pid] = null;
}

Threads.prototype.count = function() {
    return this.threads.length - this.empty.length;
}

Threads.prototype.getThread = function(pid) {
    return this.threads[pid];
}



