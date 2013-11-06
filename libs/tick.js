/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

module.exports.globalize = function() {
    if ( !global.TICK ) {
        global.TICK = setImmediate || process.nextTick;
    }
}
