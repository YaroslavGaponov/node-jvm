/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

module.exports.getByte = function(v) {
    n = parseInt(v, 10) & 0xff;
    if (n > 0x7F) {
        n = -((n & 0x7F) ^ 0x7F) - 1;
    }
    return n
}

module.exports.getInt = function(v) {
    n = parseInt(v, 10) & 0xffff;
    if (n > 0x7FFF) {
        n = -((n & 0x7FFF) ^ 0x7FFF) - 1;
    }
    return n
}

module.exports.getLong = function(bytes) {
    var l = 0;
    for(var i = 0; i < 8; i++) {
       l <<= 8;
       l ^= bytes[i] & 0xFF;
    }
    return l;
}

