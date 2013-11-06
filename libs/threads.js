/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/


var Threads = module.exports = function() {
    this.threads = [];
}

Threads.prototype.add = function(id) {
    id = id || this.threads.length;
    this.threads.push(id);
    return id;
}

Threads.prototype.remove = function(id) {
    var idx = this.threads.indexOf(id);
    if (idx > -1) {
        this.threads.splice(idx, 1);
    }
}

Threads.prototype.length = function() {
    return this.threads.length;
}



