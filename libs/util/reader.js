/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var Reader = function(bytes, offset) {
    if (this instanceof Reader) {
        this.bytes = bytes;
        this.offset = offset || 0;
    } else {
        return new Reader(bytes, offset);
    }
}

Reader.prototype.read8 = function() {
    var data = this.bytes.readUInt8(this.offset);
    this.offset += 1;
    return data;
}

Reader.prototype.read16 = function() {
    var data = this.bytes.readUInt16BE(this.offset);
    this.offset += 2;
    return data;
}

Reader.prototype.read32 = function() {
    var data = this.bytes.readUInt32BE(this.offset);
    this.offset += 4;
    return data;
}

Reader.prototype.readString = function(length) {
    var data = this.bytes.toString(null, this.offset, this.offset + length)
    this.offset += length;
    return data;
}

Reader.prototype.readBytes = function(length) {
    var data = this.bytes.slice(this.offset, this.offset + length);
    this.offset += length;
    return data;
}


module.exports.create = function(bytes, offset) {
    return new Reader(bytes, offset);    
}
