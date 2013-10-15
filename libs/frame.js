

var Frame = module.exports = function(classArea, method) {
    if (this instanceof Frame) {
        
        this._classArea = classArea;
        this._method = method;
        this._code = method.attributes[0].info.code;
        
        this.IP = 0;
        this.LOCALS = new Array(4);
        this.STACK = [];
    } else {
        return new Frame(classArea, method);
    }
}

Frame.prototype.read8 = function() {
    return this._code[this.IP++];
};

Frame.prototype.read16 = function() {
    return this.read8()<<8 | this.read8();
};

Frame.prototype.read32 = function() {
    return this.read16()<<16 | this.read16()();
};

Frame.prototype.getConstant = function(index) {
    return this._classArea.getPoolConstant()[index];
}




