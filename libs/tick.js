/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

module.exports.initialize = function() {
    if ( !global.TICK ) {
        global.TICK = setImmediate || process.nextTick;
    }
}

module.exports.getTick = function() {
    return setImmediate || process.nextTick;
}