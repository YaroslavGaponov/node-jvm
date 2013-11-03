/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

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
            if ((this[flag] & flags) !== 0) {
                flagNames.push(flag);
            }
        }
        return flagNames.toString();
    },
    checkFlag: function(flag) {
        return function(flags) {
            return flags & flag === flag;
        }
    },
    isPublic: function(flags) {
        return this.checkFlag(this.ACC_PUBLIC);
    },
    isPrivate: function(flags) {
        return this.checkFlag(this.ACC_PRIVATE);
    },
    isProtected: function(flags) {
        return this.checkFlag(this.ACC_PROTECTED);
    },
    isStatic: function(flags) {
        return this.checkFlag(this.ACC_STATIC);
    },
    isFinal: function(flags) {
        return this.checkFlag(this.ACC_FINAL);
    },
    isSynchronized: function(flags) {
        return this.checkFlag(this.ACC_SYNCHRONIZED);
    },
    isVolatile: function(flags) {
        return this.checkFlag(this.ACC_VOLATILE);
    },
    isTransient: function(flags) {
        return this.checkFlag(this.ACC_TRANSIENT);
    },
    isNative: function(flags) {
        return this.checkFlag(this.ACC_NATIVE);
    },
    isInterface: function(flags) {
        return this.checkFlag(this.ACC_INTERFACE);
    },
    isAbstract: function(flags) {
        return this.checkFlag(this.ACC_ABSTRACT);
    }
};
