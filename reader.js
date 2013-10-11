
var StreamReader = function(bytes, offset) {
    if (this instanceof StreamReader) {
        this.bytes = bytes;
        this.offset = offset || 0;
    } else {
        return new Reader(bytes, offset);
    }
}

StreamReader.prototype.readByte = function() {
    var data = this.bytes.readUInt8(this.offset);
    this.offset += 1;
    return data;
}

StreamReader.prototype.readWord = function() {
    var data = this.bytes.readUInt16BE(this.offset);
    this.offset += 2;
    return data;
}

StreamReader.prototype.readDWord = function() {
    var data = this.bytes.readUInt32BE(this.offset);
    this.offset += 4;
    return data;
}

StreamReader.prototype.readString = function(length) {
    var data = this.bytes.toString(null, this.offset, this.offset + length)
    this.offset += length;
    return data;
}

StreamReader.prototype.readBytes = function(length) {
    var data = this.bytes.slice(this.offset, this.offset + length);
    this.offset += length;
    return data;
}


module.exports.create = function(bytes, offset) {
    return new StreamReader(bytes, offset);    
}
