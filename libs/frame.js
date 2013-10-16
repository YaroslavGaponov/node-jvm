
var ATTRIBUTE_TYPES = require("./classfile/attributetypes.js");

var Frame = module.exports = function(classArea, method) {
    if (this instanceof Frame) {
        
        this._classArea = classArea;
        this._method = method;
        
        for(var i=0; i<method.attributes.length; i++) {
            if (method.attributes[i].info.type === ATTRIBUTE_TYPES.Code) {
                this._code = method.attributes[i].info.code;
                break;
            }
        }
        
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




