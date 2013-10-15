
module.exports.getSByte = function(v) {
    n = parseInt(v, 10) & 255;
    if (n > 127) {
        n = -((n & 127) ^ 127) - 1;
    }
    return n
}

module.exports.getSInt = function(v) {
    n = parseInt(v, 10) & 65535;
    if (n > 32767) {
        n = -((n & 32767) ^ 32767) - 1;
    }
    return n
}

