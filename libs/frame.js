/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");

var Numeric = require("./util/numeric");
var Signature = require("./classfile/signature");

var TAGS = require("./classfile/tags");
var ATTRIBUTE_TYPES = require("./classfile/attributetypes");

var Frame = module.exports = function(classArea, method) {
    if (this instanceof Frame) {
        this._pid = 0; // default main thread
        this._cp = classArea.getConstantPool();
        
        for(var i=0; i<method.attributes.length; i++) {
            if (method.attributes[i].info.type === ATTRIBUTE_TYPES.Code) {
                this._code = method.attributes[i].info.code;
                this._exception_table = method.attributes[i].info.exception_table;
                this._locals = new Array(method.attributes[i].info.max_locals);
                break;
            }
        }
        
    } else {
        return new Frame(classArea, method);
    }
}

Frame.prototype.setPid = function(pid) {
    this._pid = pid;
}

Frame.prototype._read8 = function() {
    return this._code[this._ip++];
};

Frame.prototype._read16 = function() {
    return this._read8()<<8 | this._read8();
};

Frame.prototype._read32 = function() {
    return this._read16()<<16 | this._read16();
};

Frame.prototype._throw = function(ex) { 
    var handler_pc = null;
 
    for(var i=0; i<this._exception_table.length; i++) {
        if (this._ip >= this._exception_table[i].start_pc && this._ip <= this._exception_table[i].end_pc) {
            if (this._exception_table[i].catch_type === 0) {
                handler_pc = this._exception_table[i].handler_pc;             
            } else {
                var name = this._cp[this._cp[this._exception_table[i].catch_type].name_index].bytes;
                if (name === ex.getClassName()) {
                    handler_pc = this._exception_table[i].handler_pc;
                    break;
                }
            }
        }
    }
    
    if (handler_pc != null) {
        this._stack.push(ex);
        this._ip = handler_pc;      
    } else {
        throw ex;
    }
}

Frame.prototype.run = function(args, done) {
    var self = this;
    
    this._ip = 0;
    this._stack = [];
    this._widened = false;
       
    for(var i=0; i<args.length; i++) {
        this._locals[i] = args[i];
    }
    
    var step = function() {
        
        SCHEDULER.tick(self._pid, function() {
            var opCode = self._read8()
            
            switch (opCode) {
                
                case OPCODES.return:
                    return done();
                    
                case OPCODES.ireturn:
                case OPCODES.lreturn:
                case OPCODES.freturn:
                case OPCODES.dreturn:
                case OPCODES.areturn:
                    return done(self._stack.pop());
                
                default:
                    var opName = OPCODES.toString(opCode);
                    
                    if (!(opName in self)) {
                        throw new Error(util.format("Opcode %s [%s] is not supported.", opName, opCode));
                    }
        
                    self[opName]( function() { return step(); } );
                    break;
            }
        });
        
    };
    
    step();
}


Frame.prototype.nop = function(done) {
    return done();
}

Frame.prototype.aconst_null = function(done) {
    this._stack.push(null);
    return done();
}

Frame.prototype.iconst_m1 = function(done) {
    this._stack.push(-1);
    return done();
}

Frame.prototype.iconst_0 = function(done) {
    this._stack.push(0);
    return done();
}

Frame.prototype.lconst_0 = function(done) {
    this._stack.push(0);
    return done();
}

Frame.prototype.fconst_0 = function(done) {
    this._stack.push(0);
    return done();
}

Frame.prototype.dconst_0 = function(done) {
    this._stack.push(0);
    return done();
}

Frame.prototype.iconst_1 = function(done) {
    this._stack.push(1);
    return done();
}

Frame.prototype.lconst_1 = function(done) {
    this._stack.push(1);
    return done();
}

Frame.prototype.fconst_1 = function(done) {
    this._stack.push(1);
    return done();
}

Frame.prototype.dconst_1 = function(done) {
    this._stack.push(1);
    return done();
}

Frame.prototype.iconst_2 = function(done) {
    this._stack.push(2);
    return done();
}

Frame.prototype.fconst_2 = function(done) {
    this._stack.push(2);
    return done();
}

Frame.prototype.iconst_3 = function(done) {
    this._stack.push(3);
    return done();
}

Frame.prototype.iconst_4 = function(done) {
    this._stack.push(4);
    return done();
}

Frame.prototype.iconst_4 = function(done) {
    this._stack.push(5);
    return done();
}

Frame.prototype.iconst_5 = function(done) {
    this._stack.push(5);
    return done();
}

Frame.prototype.sipush = function(done) {
    this._stack.push(this._read16());
}

Frame.prototype.bipush = function(done) {
    this._stack.push(this._read8());
    return done();
}

Frame.prototype.ldc = function(done) {
    var constant = this._cp[this._read8()];
    switch(constant.tag) {
        case TAGS.CONSTANT_String:                        
            this._stack.push(this._cp[constant.string_index].bytes);
            break;
        default:
            throw new Error("not support constant type");
    }
    return done();
}

Frame.prototype.ldc_w = function(done) {
    var constant = this._cp[this._read16()];
    switch(constant.tag) {
        case TAGS.CONSTANT_String:                        
            this._stack.push(this._cp[constant.string_index].bytes);
            break;
        default:
            throw new Error("not support constant type");
    }
    return done();
}

Frame.prototype.ldc2_w = function(done) {
    var constant = this._cp[this._read16()];
    switch(constant.tag) {
        case TAGS.CONSTANT_String:                        
            this._stack.push(this._cp[constant.string_index].bytes);
            break;
        case TAGS.CONSTANT_Long:
            this._stack.push(Numeric.getLong(constant.bytes));
            break;
        case TAGS.CONSTANT_Double:
            this._stack.push(constant.bytes.readDoubleBE(0));
            break;
        default:
            throw new Error("not support constant type");
    }
    return done();
}

Frame.prototype.iload = function(done) {
    var idx = this._widened ? this._read16() : this._read8();
    this._stack.push(this._locals[idx]);
    this._widened = false;
    return done();
}

Frame.prototype.lload = function(done) {
    var idx = this._widened ? this._read16() : this._read8();
    this._stack.push(this._locals[idx]);
    this._widened = false;
    return done();
}

Frame.prototype.fload = function(done) {
    var idx = this._widened ? this._read16() : this._read8();
    this._stack.push(this._locals[idx]);
    this._widened = false;
    return done();
}

Frame.prototype.dload = function(done) {
    var idx = this._widened ? this._read16() : this._read8();
    this._stack.push(this._locals[idx]);
    this._widened = false;
    return done();
}

Frame.prototype.aload = function(done) {
    var idx = this._widened ? this._read16() : this._read8();
    this._stack.push(this._locals[idx]);
    this._widened = false;
    return done();
}

Frame.prototype.iload_0 = function(done) {
    this._stack.push(this._locals[0]);
    return done();
}

Frame.prototype.lload_0 = function(done) {
    this._stack.push(this._locals[0]);
    return done();
}

Frame.prototype.fload_0 = function(done) {
    this._stack.push(this._locals[0]);
    return done();
}

Frame.prototype.fload_0 = function(done) {
    this._stack.push(this._locals[0]);
    return done();
}

Frame.prototype.dload_0 = function(done) {
    this._stack.push(this._locals[0]);
    return done();
}

Frame.prototype.aload_0 = function(done) {
    this._stack.push(this._locals[0]);
    return done();
}

Frame.prototype.iload_1 = function(done) {
    this._stack.push(this._locals[1]);
    return done();
}

Frame.prototype.lload_1 = function(done) {
    this._stack.push(this._locals[1]);
    return done();
}

Frame.prototype.fload_1 = function(done) {
    this._stack.push(this._locals[1]);
    return done();
}

Frame.prototype.fload_1 = function(done) {
    this._stack.push(this._locals[1]);
    return done();
}

Frame.prototype.dload_1 = function(done) {
    this._stack.push(this._locals[1]);
    return done();
}

Frame.prototype.aload_1 = function(done) {
    this._stack.push(this._locals[1]);
    return done();
}

Frame.prototype.iload_2 = function(done) {
    this._stack.push(this._locals[2]);
    return done();
}

Frame.prototype.lload_2 = function(done) {
    this._stack.push(this._locals[2]);
    return done();
}

Frame.prototype.fload_2 = function(done) {
    this._stack.push(this._locals[2]);
    return done();
}

Frame.prototype.fload_2 = function(done) {
    this._stack.push(this._locals[2]);
    return done();
}

Frame.prototype.dload_2 = function(done) {
    this._stack.push(this._locals[2]);
    return done();
}

Frame.prototype.aload_2 = function(done) {
    this._stack.push(this._locals[2]);
    return done();
}

Frame.prototype.iload_3 = function(done) {
    this._stack.push(this._locals[3]);
    return done();
}

Frame.prototype.lload_3 = function(done) {
    this._stack.push(this._locals[3]);
    return done();
}

Frame.prototype.fload_3 = function(done) {
    this._stack.push(this._locals[3]);
    return done();
}

Frame.prototype.fload_3 = function(done) {
    this._stack.push(this._locals[3]);
    return done();
}

Frame.prototype.dload_3 = function(done) {
    this._stack.push(this._locals[3]);
    return done();
}

Frame.prototype.aload_3 = function(done) {
    this._stack.push(this._locals[3]);
    return done();
}

Frame.prototype.iaload = function(done) {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    
    var ex = null;
    
    if (!refArray) {
        ex = CLASSES.newException("java/lang/NullPointerException");
    } else if (idx < 0 || idx >= refArray.length) {
        ex = CLASSES.newException("java/lang/ArrayIndexOutOfBoundsException", idx);
    }
    
    if (ex) {
        this._throw(ex);
    } else {
        this._stack.push(refArray[idx]);
    }
    
    return done();
}

Frame.prototype.laload = function(done) {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    
    var ex = null;
    
    if (!refArray) {
        ex = CLASSES.newException("java/lang/NullPointerException");
    } else if (idx < 0 || idx >= refArray.length) {
        ex = CLASSES.newException("java/lang/ArrayIndexOutOfBoundsException", idx);
    }
    
    if (ex) {
        this._throw(ex);
    } else {
        this._stack.push(refArray[idx]);
    }
    
    return done();
}

Frame.prototype.faload = function(done) {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    
    var ex = null;
    
    if (!refArray) {
        ex = CLASSES.newException("java/lang/NullPointerException");
    } else if (idx < 0 || idx >= refArray.length) {
        ex = CLASSES.newException("java/lang/ArrayIndexOutOfBoundsException", idx);
    }
    
    if (ex) {
        this._throw(ex);
    } else {
        this._stack.push(refArray[idx]);
    }
    
    return done();
}


Frame.prototype.daload = function(done) {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    
    var ex = null;
    
    if (!refArray) {
        ex = CLASSES.newException("java/lang/NullPointerException");
    } else if (idx < 0 || idx >= refArray.length) {
        ex = CLASSES.newException("java/lang/ArrayIndexOutOfBoundsException", idx);
    }
    
    if (ex) {
        this._throw(ex);
    } else {
        this._stack.push(refArray[idx]);
    }
    
    return done();
}

Frame.prototype.aaload = function(done) {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    
    var ex = null;
    
    if (!refArray) {
        ex = CLASSES.newException("java/lang/NullPointerException");
    } else if (idx < 0 || idx >= refArray.length) {
        ex = CLASSES.newException("java/lang/ArrayIndexOutOfBoundsException", idx);
    }
    
    if (ex) {
        this._throw(ex);
    } else {
        this._stack.push(refArray[idx]);
    }
    
    return done();
}

Frame.prototype.baload = function(done) {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    
    var ex = null;
    
    if (!refArray) {
        ex = CLASSES.newException("java/lang/NullPointerException");
    } else if (idx < 0 || idx >= refArray.length) {
        ex = CLASSES.newException("java/lang/ArrayIndexOutOfBoundsException", idx);
    }
    
    if (ex) {
        this._throw(ex);
    } else {
        this._stack.push(refArray[idx]);
    }
    
    return done();
}

Frame.prototype.caload = function(done) {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    
    var ex = null;
    
    if (!refArray) {
        ex = CLASSES.newException("java/lang/NullPointerException");
    } else if (idx < 0 || idx >= refArray.length) {
        ex = CLASSES.newException("java/lang/ArrayIndexOutOfBoundsException", idx);
    }
    
    if (ex) {
        this._throw(ex);
    } else {
        this._stack.push(refArray[idx]);
    }
    
    return done();
}

Frame.prototype.saload = function(done) {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    
    var ex = null;
    
    if (!refArray) {
        ex = CLASSES.newException("java/lang/NullPointerException");
    } else if (idx < 0 || idx >= refArray.length) {
        ex = CLASSES.newException("java/lang/ArrayIndexOutOfBoundsException", idx);
    }
    
    if (ex) {
        this._throw(ex);
    } else {
        this._stack.push(refArray[idx]);
    }
    
    return done();
}

Frame.prototype.istore = function(done) {
    var idx = this._widened ? this._read16() : this._read8();
    this._locals[idx] = this._stack.pop();
    this._widened = false;
    return done();
}

Frame.prototype.lstore = function(done) {
    var idx = this._widened ? this._read16() : this._read8();
    this._locals[idx] = this._stack.pop();
    this._widened = false;
    return done();
}

Frame.prototype.fstore = function(done) {
    var idx = this._widened ? this._read16() : this._read8();
    this._locals[idx] = this._stack.pop();
    this._widened = false;
    return done();
}

Frame.prototype.dstore = function(done) {
    var idx = this._widened ? this._read16() : this._read8();
    this._locals[idx] = this._stack.pop();
    this._widened = false;
    return done();
}

Frame.prototype.astore = function(done) {
    var idx = this._widened ? this._read16() : this._read8();
    this._locals[idx] = this._stack.pop();
    this._widened = false;
    return done();
}

Frame.prototype.istore_0 = function(done) {
    this._locals[0] = this._stack.pop();
    return done();
}

Frame.prototype.lstore_0 = function(done) {
    this._locals[0] = this._stack.pop();
    return done();
}

Frame.prototype.fstore_0 = function(done) {
    this._locals[0] = this._stack.pop();
    return done();
}

Frame.prototype.dstore_0 = function(done) {
    this._locals[0] = this._stack.pop();
    return done();
}

Frame.prototype.astore_0 = function(done) {
    this._locals[0] = this._stack.pop();
    return done();
}

Frame.prototype.istore_1 = function(done) {
    this._locals[1] = this._stack.pop();
    return done();
}

Frame.prototype.lstore_1 = function(done) {
    this._locals[1] = this._stack.pop();
    return done();
}

Frame.prototype.fstore_1 = function(done) {
    this._locals[1] = this._stack.pop();
    return done();
}

Frame.prototype.dstore_1 = function(done) {
    this._locals[1] = this._stack.pop();
    return done();
}

Frame.prototype.astore_1 = function(done) {
    this._locals[1] = this._stack.pop();
    return done();
}


Frame.prototype.istore_2 = function(done) {
    this._locals[2] = this._stack.pop();
    return done();
}

Frame.prototype.lstore_2 = function(done) {
    this._locals[2] = this._stack.pop();
    return done();
}

Frame.prototype.fstore_2 = function(done) {
    this._locals[2] = this._stack.pop();
    return done();
}

Frame.prototype.dstore_2 = function(done) {
    this._locals[2] = this._stack.pop();
    return done();
}

Frame.prototype.astore_2 = function(done) {
    this._locals[2] = this._stack.pop();
    return done();
}

Frame.prototype.istore_3 = function(done) {
    this._locals[3] = this._stack.pop();
    return done();
}

Frame.prototype.lstore_3 = function(done) {
    this._locals[3] = this._stack.pop();
    return done();
}

Frame.prototype.fstore_3 = function(done) {
    this._locals[3] = this._stack.pop();
    return done();
}

Frame.prototype.dstore_3 = function(done) {
    this._locals[3] = this._stack.pop();
    return done();
}

Frame.prototype.astore_3 = function(done) {
    this._locals[3] = this._stack.pop();
    return done();
}

Frame.prototype.iastore = function(done) {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var refArray = this._stack.pop();
    
    
    var ex = null;
    
    if (!refArray) {
        ex = CLASSES.newException("java/lang/NullPointerException");
    } else if (idx < 0 || idx >= refArray.length) {
        ex = CLASSES.newException("java/lang/ArrayIndexOutOfBoundsException", idx);
    }
    
    if (ex) {
        this._throw(ex);
    } else {
        refArray[idx] = val;
    }
    
    return done();
}

Frame.prototype.lastore = function(done) {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var refArray = this._stack.pop();
    
    
    var ex = null;
    
    if (!refArray) {
        ex = CLASSES.newException("java/lang/NullPointerException");
    } else if (idx < 0 || idx >= refArray.length) {
        ex = CLASSES.newException("java/lang/ArrayIndexOutOfBoundsException", idx);
    }
    
    if (ex) {
        this._throw(ex);
    } else {
        refArray[idx] = val;
    }
    
    return done();
}

Frame.prototype.fastore = function(done) {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var refArray = this._stack.pop();
    
    
    var ex = null;
    
    if (!refArray) {
        ex = CLASSES.newException("java/lang/NullPointerException");
    } else if (idx < 0 || idx >= refArray.length) {
        ex = CLASSES.newException("java/lang/ArrayIndexOutOfBoundsException", idx);
    }
    
    if (ex) {
        this._throw(ex);
    } else {
        refArray[idx] = val;
    }
    
    return done();
}

Frame.prototype.dastore = function(done) {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var refArray = this._stack.pop();
    
    
    var ex = null;
    
    if (!refArray) {
        ex = CLASSES.newException("java/lang/NullPointerException");
    } else if (idx < 0 || idx >= refArray.length) {
        ex = CLASSES.newException("java/lang/ArrayIndexOutOfBoundsException", idx);
    }
    
    if (ex) {
        this._throw(ex);
    } else {
        refArray[idx] = val;
    }
    
    return done();
}

Frame.prototype.aastore = function(done) {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var refArray = this._stack.pop();
    
    
    var ex = null;
    
    if (!refArray) {
        ex = CLASSES.newException("java/lang/NullPointerException");
    } else if (idx < 0 || idx >= refArray.length) {
        ex = CLASSES.newException("java/lang/ArrayIndexOutOfBoundsException", idx);
    }
    
    if (ex) {
        this._throw(ex);
    } else {
        refArray[idx] = val;
    }
    
    return done();
}

Frame.prototype.bastore = function(done) {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var refArray = this._stack.pop();
    
    
    var ex = null;
    
    if (!refArray) {
        ex = CLASSES.newException("java/lang/NullPointerException");
    } else if (idx < 0 || idx >= refArray.length) {
        ex = CLASSES.newException("java/lang/ArrayIndexOutOfBoundsException", idx);
    }
    
    if (ex) {
        this._throw(ex);
    } else {
        refArray[idx] = val;
    }
    
    return done();
}

Frame.prototype.castore = function(done) {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var refArray = this._stack.pop();
    
    
    var ex = null;
    
    if (!refArray) {
        ex = CLASSES.newException("java/lang/NullPointerException");
    } else if (idx < 0 || idx >= refArray.length) {
        ex = CLASSES.newException("java/lang/ArrayIndexOutOfBoundsException", idx);
    }
    
    if (ex) {
        this._throw(ex);
    } else {
        refArray[idx] = val;
    }
    
    return done();
}

Frame.prototype.sastore = function(done) {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var refArray = this._stack.pop();
    
    
    var ex = null;
    
    if (!refArray) {
        ex = CLASSES.newException("java/lang/NullPointerException");
    } else if (idx < 0 || idx >= refArray.length) {
        ex = CLASSES.newException("java/lang/ArrayIndexOutOfBoundsException", idx);
    }
    
    if (ex) {
        this._throw(ex);
    } else {
        refArray[idx] = val;
    }
    
    return done();
}

Frame.prototype.pop = function(done) {
    this._stack.pop();
    return done();
}

Frame.prototype.pop2 = function(done) {
    this._stack.pop();
    return done();
}

Frame.prototype.dup = function(done) {
    var val = this._stack.pop();
    this._stack.push(val);
    this._stack.push(val);
    return done();
}

Frame.prototype.dup_x1 = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val1);
    this._stack.push(val2);
    this._stack.push(val1);
    return done();
}

Frame.prototype.dup_x2 = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    var val3 = this._stack.pop();    
    this._stack.push(val1);
    this._stack.push(val3);
    this._stack.push(val2);    
    this._stack.push(val1);
    return done();
}

Frame.prototype.dup2 = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2);
    this._stack.push(val1);
    this._stack.push(val2);
    this._stack.push(val1);
    return done();
}

Frame.prototype.dup2_x1 = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    var val3 = this._stack.pop();
    this._stack.push(val2);
    this._stack.push(val1);
    this._stack.push(val3);
    this._stack.push(val2);
    this._stack.push(val1);
    return done();
}

Frame.prototype.dup2_x2 = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    var val3 = this._stack.pop();
    var val4 = this._stack.pop();
    this._stack.push(val2);
    this._stack.push(val1);
    this._stack.push(val4);
    this._stack.push(val3);
    this._stack.push(val2);
    this._stack.push(val1);
    return done();
}


Frame.prototype.swap = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val1);
    this._stack.push(val2);
    return done();
}


Frame.prototype.iinc = function(done) {
    var idx = this._widened ? this._read16() : this._read8();
    var val = this._widened ? this._read16() : this._read8();
    this._locals[idx] += val
    this._widened = false;
    return done();
}

Frame.prototype.iadd = function(done) {
    this._stack.push(this._stack.pop() + this._stack.pop());
    return done();
}

Frame.prototype.ladd = function(done) {
    this._stack.push(this._stack.pop() + this._stack.pop());
    return done();
}

Frame.prototype.dadd = function(done) {
    this._stack.push(this._stack.pop() + this._stack.pop());
    return done();
}

Frame.prototype.fadd = function(done) {
    this._stack.push(this._stack.pop() + this._stack.pop());
    return done();
}

Frame.prototype.isub = function(done) {
    this._stack.push(- this._stack.pop() + this._stack.pop());
    return done();
}

Frame.prototype.lsub = function(done) {
    this._stack.push(- this._stack.pop() + this._stack.pop());
    return done();
}

Frame.prototype.dsub = function(done) {
    this._stack.push(- this._stack.pop() + this._stack.pop());
    return done();
}

Frame.prototype.fsub = function(done) {
    this._stack.push(- this._stack.pop() + this._stack.pop());
    return done();
}

Frame.prototype.imul = function(done) {
    this._stack.push(this._stack.pop() * this._stack.pop());
    return done();
}

Frame.prototype.lmul = function(done) {
    this._stack.push(this._stack.pop() * this._stack.pop());
    return done();
}

Frame.prototype.dmul = function(done) {
    this._stack.push(this._stack.pop() * this._stack.pop());
    return done();
}

Frame.prototype.fmul = function(done) {
    this._stack.push(this._stack.pop() * this._stack.pop());
    return done();
}

Frame.prototype.idiv = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    if (val1 === 0) {
        this._throw(CLASSES.newException("java/lang/ArithmeticException"));
    } else {
        this._stack.push(val2 / val1);
    }
    return done();
}

Frame.prototype.ldiv = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    if (val1 === 0) {
        this._throw(CLASSES.newException("java/lang/ArithmeticException"));
    } else {
        this._stack.push(val2 / val1);
    }
    return done();
}

Frame.prototype.ddiv = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 / val1);
    return done();
}

Frame.prototype.fdiv = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 / val1);
    return done();
}

Frame.prototype.irem = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 % val1);
    return done();
}

Frame.prototype.lrem = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 % val1);
    return done();
}

Frame.prototype.drem = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 % val1);
    return done();
}

Frame.prototype.frem = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 % val1);
    return done();
}

Frame.prototype.ineg = function(done) {
    this._stack.push(- this._stack.pop());
    return done();
}

Frame.prototype.lneg = function(done) {
    this._stack.push(- this._stack.pop());
    return done();
}

Frame.prototype.dneg = function(done) {
    this._stack.push(- this._stack.pop());
    return done();
}

Frame.prototype.fneg = function(done) {
    this._stack.push(- this._stack.pop());
    return done();
}

Frame.prototype.ishl = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 << val1);
    return done();
}

Frame.prototype.lshl = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 << val1);
    return done();
}

Frame.prototype.ishr = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 >> val1);
    return done();
}

Frame.prototype.lshr = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 >> val1);
    return done();
}

Frame.prototype.iushr = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 >>> val1);
    return done();
}

Frame.prototype.lushr = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 >>> val1);
    return done();
}

Frame.prototype.iand = function(done) {
    this._stack.push(this._stack.pop() & this._stack.pop());
    return done();
}

Frame.prototype.land = function(done) {
    this._stack.push(this._stack.pop() & this._stack.pop());
    return done();
}

Frame.prototype.ior = function(done) {
    this._stack.push(this._stack.pop() | this._stack.pop());
    return done();
}

Frame.prototype.lor = function(done) {
    this._stack.push(this._stack.pop() | this._stack.pop());
    return done();
}

Frame.prototype.ixor = function(done) {
    this._stack.push(this._stack.pop() ^ this._stack.pop());
    return done();
}

Frame.prototype.lxor = function(done) {
    this._stack.push(this._stack.pop() ^ this._stack.pop());
    return done();
}

Frame.prototype.lcmp = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    if (val2 > val1) {
        this._stack.push(1);
    } else if (val2 < val1) {
        this._stack.push(-1);
    } else {
        this._stack.push(0);
    }
    return done();
}

Frame.prototype.fcmpl = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    if (isNaN(val1) || isNaN(val2)) {
        this._stack.push(-1);
    } else if (val2 > val1) {
        this._stack.push(1);
    } else if (val2 < val1) {
        this._stack.push(-1);
    } else {
        this._stack.push(0);
    }    
    return done;
}

Frame.prototype.fcmpg = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    if (isNaN(val1) || isNaN(val2)) {
        this._stack.push(1);
    } else if (val2 > val1) {
        this._stack.push(1);
    } else if (val2 < val1) {
        this._stack.push(-1);
    } else {
        this._stack.push(0);
    }    
    return done;
}

Frame.prototype.dcmpl = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    if (isNaN(val1) || isNaN(val2)) {
        this._stack.push(-1);
    } else if (val2 > val1) {
        this._stack.push(1);
    } else if (val2 < val1) {
        this._stack.push(-1);
    } else {
        this._stack.push(0);
    }    
    return done;
}

Frame.prototype.dcmpg = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    if (isNaN(val1) || isNaN(val2)) {
        this._stack.push(1);
    } else if (val2 > val1) {
        this._stack.push(1);
    } else if (val2 < val1) {
        this._stack.push(-1);
    } else {
        this._stack.push(0);
    }    
    return done;
}


Frame.prototype.newarray = function(done) {
    var type = this._read8();  
    var size = this._stack.pop();
    if (size < 0) {
        this._throw(CLASSES.newException("java/lang/NegativeSizeException"));
    } else {
        this._stack.push(new Array(size));
    }
    return done();    
}


Frame.prototype.anewarray = function(done) {
    var idx = this._read16();
    var className = this._cp[this._cp[idx].name_index].bytes;       
    var size = this._stack.pop();
    if (size < 0) {
        this._throw(CLASSES.newException("java/lang/NegativeSizeException"));
    } else {
        this._stack.push(new Array(size));
    }
    return done();
}

Frame.prototype.multianewarray = function(done) {
    var idx = this._read16();
    var type = this._cp[this._cp[idx].name_index].bytes;       
    var dimensions = this._read8();
    var lengths = new Array(dimensions);
    for(var i=0; i<dimensions; i++) {
        lengths[i] = this._stack.pop();
    }
    var createMultiArray = function(lengths) {
        if (lengths.length === 0) {
            return null;
        }
        var length = lengths.shift();
        var array = new Array(length);
        for (var i=0; i<length; i++) {
            array[i] = createMultiArray(lengths);
        }
        return array;
    };
    this._stack.push(createMultiArray(lengths));    
    return done();
}

Frame.prototype.arraylength = function(done) {
    var ref = this._stack.pop();
    this._stack.push(ref.length);
    return done();
}

Frame.prototype.if_icmpeq = function(done) {
    var jmp = this._ip - 1 + Numeric.getInt(this._read16());                                
    var ref1 = this._stack.pop();
    var ref2 = this._stack.pop();
    this._ip = ref1 === ref2 ? jmp : this._ip;
    return done();
}

Frame.prototype.if_icmpne = function(done) {
    var jmp = this._ip - 1 + Numeric.getInt(this._read16());                                
    var ref1 = this._stack.pop();
    var ref2 = this._stack.pop();
    this._ip = ref1 !== ref2 ? jmp : this._ip;
    return done();
}

Frame.prototype.if_icmpgt = function(done) {
    var jmp = this._ip - 1 + Numeric.getInt(this._read16());                                
    var ref1 = this._stack.pop();
    var ref2 = this._stack.pop();
    this._ip = ref1 < ref2 ? jmp : this._ip;
    return done();
}

Frame.prototype.if_icmple = function(done) {
    var jmp = this._ip - 1 + Numeric.getInt(this._read16());
    this._ip = this._stack.pop() >= this._stack.pop() ? jmp : this._ip;
    return done();
}

Frame.prototype.if_icmplt = function(done) {
    var jmp = this._ip - 1 + Numeric.getInt(this._read16());
    this._ip = this._stack.pop() > this._stack.pop() ? jmp : this._ip;
    return done();
}

Frame.prototype.if_icmpge = function(done) {
    var jmp = this._ip - 1 + Numeric.getInt(this._read16());                                
    var ref1 = this._stack.pop();
    var ref2 = this._stack.pop();
    this._ip = ref1 <= ref2 ? jmp : this._ip;
    return done();
}

Frame.prototype.if_acmpeq = function(done) {
    var jmp = this._ip - 1 + Numeric.getInt(this._read16());                                
    var ref1 = this._stack.pop();
    var ref2 = this._stack.pop();
    this._ip = ref1 === ref2 ? jmp : this._ip;
    return done();
}

Frame.prototype.if_acmpne = function(done) {
    var jmp = this._ip - 1 + Numeric.getInt(this._read16());                                
    var ref1 = this._stack.pop();
    var ref2 = this._stack.pop();
    this._ip = ref1 !== ref2 ? jmp : this._ip;
    return done();
}

Frame.prototype.ifne = function(done) {
    var jmp = this._ip - 1 + Numeric.getInt(this._read16());
    this._ip = this._stack.pop() !== 0 ? jmp : this._ip;
    return done();
}

Frame.prototype.ifeq = function(done) {
    var jmp = this._ip - 1 + Numeric.getInt(this._read16());
    this._ip = this._stack.pop() === 0 ? jmp : this._ip;
    return done();
}

Frame.prototype.iflt = function(done) {
    var jmp = this._ip - 1 + Numeric.getInt(this._read16());
    this._ip = this._stack.pop() < 0 ? jmp : this._ip;
    return done();
}

Frame.prototype.ifge = function(done) {
    var jmp = this._ip - 1 + Numeric.getInt(this._read16());
    this._ip = this._stack.pop() >= 0 ? jmp : this._ip;
    return done();
}

Frame.prototype.ifgt = function(done) {
    var jmp = this._ip - 1 + Numeric.getInt(this._read16());
    this._ip = this._stack.pop() > 0 ? jmp : this._ip;
    return done();
}

Frame.prototype.ifle = function(done) {
    var jmp = this._ip - 1 + Numeric.getInt(this._read16());
    this._ip = this._stack.pop() <= 0 ? jmp : this._ip;
    return done();
}

Frame.prototype.i2l = function(done) {
    return done();
}

Frame.prototype.i2f = function(done) {
    return done();
}

Frame.prototype.i2d = function(done) {
    return done();
}

Frame.prototype.i2b = function(done) {
    return done();
}

Frame.prototype.i2c = function(done) {
    return done();
}

Frame.prototype.i2s = function(done) {
    return done();
}

Frame.prototype.l2i = function(done) {
    return done();
}

Frame.prototype.l2d = function(done) {
    return done();
}

Frame.prototype.l2f = function(done) {
    return done();
}

Frame.prototype.d2i = function(done) {
    return done();
}

Frame.prototype.d2l = function(done) {
    return done();
}

Frame.prototype.d2f = function(done) {
    return done();
}

Frame.prototype.f2d = function(done) {
    return done();
}

Frame.prototype.f2i = function(done) {
    return done();
}

Frame.prototype.f2l = function(done) {
    return done();
}

Frame.prototype.goto = function(done) {
    this._ip += Numeric.getInt(this._read16()) - 1;
    return done();
}

Frame.prototype.goto_w = function(done) {
    this._ip += Numeric.getInt(this._read32()) - 1;
    return done();
}

Frame.prototype.ifnull = function(done) {
    var ref = this._stack.pop();
    if (!ref) {
        this._ip += Numeric.getInt(this._read16()) - 1;
    }
    return done();
}

Frame.prototype.ifnonnull = function(done) {
    var ref = this._stack.pop();
    if (!!ref) {
        this._ip += Numeric.getInt(this._read16()) - 1;
    }
    return done();
}

Frame.prototype.putfield = function(done) {
    var idx = this._read16();
    var fieldName = this._cp[this._cp[this._cp[idx].name_and_type_index].name_index].bytes;    
    var val = this._stack.pop();
    var obj = this._stack.pop();
    if (!obj) {
        this._throw(CLASSES.newException("java/lang/NullPointerException"));
    } else {
        obj[fieldName] = val;
    }
    return done();
}

Frame.prototype.getfield = function(done) {    
    var idx = this._read16();
    var fieldName = this._cp[this._cp[this._cp[idx].name_and_type_index].name_index].bytes;
    var obj = this._stack.pop();
    if (!obj) {
        this._throw(CLASSES.newException("java/lang/NullPointerException"));
    } else {
        this._stack.push(obj[fieldName]);
    }
    return done();
}


Frame.prototype.new = function(done) {
    var idx = this._read16();
    var className = this._cp[this._cp[idx].name_index].bytes;    
    this._stack.push(CLASSES.newObject(className));
    return done();
}

Frame.prototype.getstatic = function(done) {    
    var idx = this._read16();
    var className = this._cp[this._cp[this._cp[idx].class_index].name_index].bytes;
    var fieldName = this._cp[this._cp[this._cp[idx].name_and_type_index].name_index].bytes;
    this._stack.push(CLASSES.getStaticField(className, fieldName));
    return done();
}

Frame.prototype.putstatic = function(done) {
    var idx = this._read16();
    var className = this._cp[this._cp[this._cp[idx].class_index].name_index].bytes;
    var fieldName = this._cp[this._cp[this._cp[idx].name_and_type_index].name_index].bytes;
    CLASSES.setStaticField(className, fieldName, this._stack.pop());
    return done();
}

Frame.prototype.invokestatic = function(done) {
    var self = this;
    
    var idx = this._read16();
    
    var className = this._cp[this._cp[this._cp[idx].class_index].name_index].bytes;
    var methodName = this._cp[this._cp[this._cp[idx].name_and_type_index].name_index].bytes;
    var signature = Signature.parse(this._cp[this._cp[this._cp[idx].name_and_type_index].signature_index].bytes);
    
    var args = [];
    for (var i=0; i<signature.IN.length; i++) {
        if (!signature.IN[i].isArray && ["long", "double"].indexOf(signature.IN[i].type) !== -1) {
            args.unshift("");
            args.unshift(this._stack.pop());
        } else {
            args.unshift(this._stack.pop());
        }
    }
    
    var method = CLASSES.getStaticMethod(className, methodName, signature);
    
    if (method instanceof Frame) {
        method.setPid(self._pid);
        method.run(args, function(res) {
            if (signature.OUT.length != 0) {                        
               self._stack.push(res);
            }
            return done();
        });
    } else {
        var res = method.apply(null, args);
        if (signature.OUT.length != 0) {                        
            self._stack.push(res);                        
        }
        return done();
    }
}    


Frame.prototype.invokevirtual = function(done) {
    var self = this;
    
    var idx = this._read16();
    
    var className = this._cp[this._cp[this._cp[idx].class_index].name_index].bytes;
    var methodName = this._cp[this._cp[this._cp[idx].name_and_type_index].name_index].bytes;
    var signature = Signature.parse(this._cp[this._cp[this._cp[idx].name_and_type_index].signature_index].bytes);
    
    var args = [];
    for (var i=0; i<signature.IN.length; i++) {
        if (!signature.IN[i].isArray && ["long", "double"].indexOf(signature.IN[i].type) !== -1) {
            args.unshift("");
            args.unshift(this._stack.pop());
        } else {
            args.unshift(this._stack.pop());
        }
    }

    
    var instance = this._stack.pop();
    var method = CLASSES.getMethod(className, methodName, signature);
      
    if (method instanceof Frame) {
        args.unshift(instance);
        method.setPid(self._pid);
        method.run(args, function(res) {
            if (signature.OUT.length != 0) {                        
               self._stack.push(res);
            }
            return done();            
        });
    } else {
        var res = method.apply(instance, args);        
        if (signature.OUT.length != 0) {
            self._stack.push(res);
        }
        return done();
    }
}

Frame.prototype.invokespecial = function(done) {
    var self = this;
    
    var idx = this._read16();
    
    var className = this._cp[this._cp[this._cp[idx].class_index].name_index].bytes;
    var methodName = this._cp[this._cp[this._cp[idx].name_and_type_index].name_index].bytes;
    var signature = Signature.parse(this._cp[this._cp[this._cp[idx].name_and_type_index].signature_index].bytes);
    
    var args = [];
    for (var i=0; i<signature.IN.length; i++) {
        if (!signature.IN[i].isArray && ["long", "double"].indexOf(signature.IN[i].type) !== -1) {
            args.unshift("");
            args.unshift(this._stack.pop());
        } else {
            args.unshift(this._stack.pop());
        }
    }


    var instance = this._stack.pop();
    var ctor = CLASSES.getMethod(className, methodName, signature);
    
    if (ctor instanceof Frame) {
        args.unshift(instance);
        ctor.setPid(self._pid);
        ctor.run(args, function() {
            return done();
        });
    } else {
        ctor.apply(instance, args);
        return done();
    }
    
}

Frame.prototype.invokeinterface = function(done) {
    var self = this;
    
    var idx = this._read16();
    var argsNumber = this._read8();
    var zero = this._read8();
    
    var className = this._cp[this._cp[this._cp[idx].class_index].name_index].bytes;
    var methodName = this._cp[this._cp[this._cp[idx].name_and_type_index].name_index].bytes;
    var signature = Signature.parse(this._cp[this._cp[this._cp[idx].name_and_type_index].signature_index].bytes);
    
    var args = [];
    for (var i=0; i<signature.IN.length; i++) {
        if (!signature.IN[i].isArray && ["long", "double"].indexOf(signature.IN[i].type) !== -1) {
            args.unshift("");
            args.unshift(this._stack.pop());
        } else {
            args.unshift(this._stack.pop());
        }
    }


    var instance = this._stack.pop();
      
    if (instance[methodName] instanceof Frame) {
        args.unshift(instance);
        instance[methodName].setPid(self._pid);
        instance[methodName].run(args, function(res) {
            if (signature.OUT.length != 0) {                        
               self._stack.push(res);
            }
            return done();            
        });
    } else {
        var res = instance[methodName].apply(instance, args);
        if (signature.OUT.length != 0) {
            self._stack.push(res);
        }
        return done();
    }
}

Frame.prototype.jsr = function(done) {
    var jmp = this._read16();
    this._stack.push(this._ip);
    this._ip = jmp;
    return done();
}

Frame.prototype.jsr_w = function(done) {
    var jmp = this._read32();
    this._stack.push(this._ip);
    this._ip = jmp;
    return done();
}

Frame.prototype.ret = function(done) {   
    var idx = this._widened ? this._read16() : this._read8();
    this._ip = this._locals[idx]; 
    this._widened = false;
    return done();
}

Frame.prototype.tableswitch = function(done) {

    var startip = this._ip;
    var jmp;

    while ((this._ip % 4) != 0) {
        this._ip++;
    }
        
    var def = this._read32();
    var low = this._read32();
    var high = this._read32();
    var val = this._stack.pop();
    
    if (val < low || val > high) {
        jmp = def;
    } else {
        this._ip  += (val - low) << 2;
        jmp = this._read32();        
    }    
    
    this._ip = startip - 1 + Numeric.getInt(jmp);
    
    return done();
}

Frame.prototype.lookupswitch = function(done) {

    var startip = this._ip;

    while ((this._ip % 4) != 0) {
        this._ip++;
    }
        
    var jmp = this._read32();
    var size = this._read32();
    var val = this._stack.pop();
    
    lookup:
        for(var i=0; i<size; i++) {
            var key = this._read32();
            var offset = this._read32();
            if (key === val) {
                jmp = offset;
            }
            if (key >= val) {
                break lookup;    
            }
        }
      
    this._ip = startip - 1 + Numeric.getInt(jmp);
    
    return done();
}

Frame.prototype.instanceof = function(done) {
    var idx = this._read16();
    var className = this._cp[this._cp[idx].name_index].bytes;
    var obj = this._stack.pop();
    if (obj.getClassName() === className) {
        this._stack.push(true);
    } else {
        this._stack.push(false);
    }
    return done();
}

Frame.prototype.checkcast = function(done) {
    var idx = this._read16();
    var type = this._cp[this._cp[idx].name_index].bytes;
    return done();
}


Frame.prototype.athrow = function(done) {
    this._throw(this._stack.pop());
    return done();
}

Frame.prototype.wide = function(done) {
    this._widened = true;
    return done();
}

Frame.prototype.monitorenter = function(done) {
    var obj = this._stack.pop();
    if (!obj) {
        this._throw(CLASSES.newException("java/lang/NullPointerException"));
    } else if (obj.hasOwnProperty("$lock$")) {
        this._stack.push(obj);
        this._ip--;
        SCHEDULER.yield();
    } else {
        obj["$lock$"] = "locked";
    }
    return done();
}

Frame.prototype.monitorexit = function(done) {
    var obj = this._stack.pop();
    if (!obj) {
        this._throw(CLASSES.newException("java/lang/NullPointerException"));
    } else {
        delete obj["$lock$"];
        SCHEDULER.yield();
    }
    return done();
}

