/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var Thread = function(id) {
    this.id = id;
}

var Threads = function() {
    this.threads = {};
    this.list = [];
}

Threads.prototype.add = function(id) {
    var id = id || Object.keys(this.threads).length;
    this.threads[id] = new Thread(id);
    return id;
}

Threads.prototype.remove = function(id) {
    delete this.threads[id];
    var idx = this.list.indexOf(id);
    if ( idx > -1 ) {
        this.list.splice(idx, 1);
    }
}

Threads.prototype.join = function(id) {
    var idx = this.list.indexOf(id);
    if ( idx === -1 ) {
        this.list.push(id);
    }
}

Threads.prototype.list = function() {
    return Object.keys(this.threads);
}

Threads.prototype.isEmpty = function() {
    return this.list.length === 0;
}

module.exports.initialize = function() {
    if ( ! global.THREADS ) {
        global.THREADS = new Threads();
    }
    return global.THREADS;
}

