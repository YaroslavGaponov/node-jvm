/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var checkFlag = function(flag) {
    return function(flags) {
        return ((flags & flag) === flag);
    }
};

var ACCESS_FLAGS = module.exports = {
    ACC_PUBLIC: 0x0001,
    ACC_PRIVATE: 0x0002,
    ACC_PROTECTED: 0x0004,
    ACC_STATIC: 0x0008,
    ACC_FINAL: 0x0010,
    ACC_SYNCHRONIZED: 0x0020,
    ACC_VOLATILE: 0x0040,
    ACC_TRANSIENT: 0x0080,
    ACC_NATIVE: 0x0100,
    ACC_INTERFACE: 0x0200,
    ACC_ABSTRACT: 0x0400,
    toString: function(flags) {
        var flagNames = [];
        for(var flag in this) {
            if ((this[flag] & flags) === this[flag]) {
                flagNames.push(flag);
            }
        }
        return flagNames.toString();
    },
    isPublic:       function(flags) { return checkFlag(this.ACC_PUBLIC)(flags) },
    isPrivate:      function(flags) { return checkFlag(this.ACC_PRIVATE)(flags) },
    isProtected:    function(flags) { return checkFlag(this.ACC_PROTECTED)(flags) },
    isStatic:       function(flags) { return checkFlag(this.ACC_STATIC)(flags) },
    isFinal:        function(flags) { return checkFlag(this.ACC_FINAL)(flags) },
    isSynchronized: function(flags) { return checkFlag(this.ACC_SYNCHRONIZED)(flags) },
    isVolatile:     function(flags) { return checkFlag(this.ACC_VOLATILE)(flags) },
    isTransient:    function(flags) { return checkFlag(this.ACC_TRANSIENT)(flags) },
    isNative:       function(flags) { return checkFlag(this.ACC_NATIVE)(flags) },
    isInterface:    function(flags) { return checkFlag(this.ACC_INTERFACE)(flags) },
    isAbstract:     function(flags) { return checkFlag(this.ACC_ABSTRACT)(flags) }
};



