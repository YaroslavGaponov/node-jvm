/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

module.exports.add = function(name, obj) {
    global[name] = obj;
}

module.exports.remove = function(name) {
    delete global[name];
}