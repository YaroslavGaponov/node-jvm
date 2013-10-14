
module.exports.getSInt = function(v) {
    n = parseInt(v, 10) & 255;
    if (n > 127) {
        n = -((n & 127) ^ 127) - 1;
    }
    return n
}

