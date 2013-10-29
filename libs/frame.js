
var util = require("util");
var Opcodes = require("./opcodes.js");
var Helper = require("./util/helper.js");
var Signature = require("./classfile/signature.js");
var TAGS = require("./classfile/tags.js");
var ATTRIBUTE_TYPES = require("./classfile/attributetypes.js");

var Frame = module.exports = function(api, classArea, method) {
    if (this instanceof Frame) {
        
        this._api = api;
        this._classArea = classArea;
        this._method = method;
        
        for(var i=0; i<method.attributes.length; i++) {
            if (method.attributes[i].info.type === ATTRIBUTE_TYPES.Code) {
                this._code = method.attributes[i].info.code;
                this._max_locals = method.attributes[i].info.max_locals;
                break;
            }
        }
        
    } else {
        return new Frame(api, classArea, method);
    }
}

Frame.prototype._fetch8 = function() {
    return this._code[this._ip];
};

Frame.prototype._read8 = function() {
    return this._code[this._ip++];
};

Frame.prototype._read16 = function() {
    return this._read8()<<8 | this._read8();
};

Frame.prototype._read32 = function() {
    return this._read16()<<16 | this._read16();
};

Frame.prototype._get = function(index) {
    return this._classArea.getPoolConstant()[index];
}

Frame.prototype.run = function(args, done) {
    var self = this;
    
    this._ip = 0;
    this._stack = [];
    this._locals = new Array(this._max_locals);
       
    for(var i=0; i<args.length; i++) {
        this._locals[i] = args[i];
    }
    
    var step = function() {
        process.nextTick(function() {
            var opCode = self._read8()
            
            switch(opCode) {
                case Opcodes.return:
                   return done();
                case Opcodes.ireturn:
                case Opcodes.lreturn:
                case Opcodes.freturn:
                case Opcodes.dreturn:
                case Opcodes.areturn:
                    return done(self._stack.pop());
            }
    
            var opName = Opcodes.toString(opCode);
            
            if (!self[opName]) {
                throw new Error(util.format("Opcode %s [%s] is not support.", opName, opCode));
            }
            
            self[opName](function() {
                return step();
            });
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
    var constant = this._get(this._read8());
    switch(constant.tag) {
        case TAGS.CONSTANT_String:                        
            this._stack.push(this._get(constant.string_index).bytes);
            break;
        default:
            throw new Error("not support constant type");
    }
    return done();
}

Frame.prototype.ldc_w = function(done) {
    var constant = this._get(this._read16());
    switch(constant.tag) {
        case TAGS.CONSTANT_String:                        
            this._stack.push(this._get(constant.string_index).bytes);
            break;
        default:
            throw new Error("not support constant type");
    }
    return done();
}

Frame.prototype.ldc2_w = function(done) {
    var constant = this._get(this._read16());
    switch(constant.tag) {
        case TAGS.CONSTANT_String:                        
            this._stack.push(this._get(constant.string_index).bytes);
            break;
        default:
            throw new Error("not support constant type");
    }
    return done();
}

Frame.prototype.iload = function(done) {
    this._stack.push(this._locals[this._read8()]);
    return done();
}

Frame.prototype.lload = function(done) {
    this._stack.push(this._locals[this._read8()]);
    return done();
}

Frame.prototype.fload = function(done) {
    this._stack.push(this._locals[this._read8()]);
    return done();
}

Frame.prototype.dload = function(done) {
    this._stack.push(this._locals[this._read8()]);
    return done();
}

Frame.prototype.aload = function(done) {
    this._stack.push(this._locals[this._read8()]);
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
    this._stack.push(refArray[idx]);
    return done();
}

Frame.prototype.laload = function(done) {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[idx]);
    return done();
}

Frame.prototype.faload = function(done) {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[idx]);
    return done();
}


Frame.prototype.daload = function(done) {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[idx]);
    return done();
}

Frame.prototype.aaload = function(done) {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[idx]);
    return done();
}

Frame.prototype.baload = function(done) {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[idx]);
    return done();
}

Frame.prototype.caload = function(done) {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[idx]);
    return done();
}

Frame.prototype.saload = function(done) {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[idx]);
    return done();
}

Frame.prototype.istore = function(done) {
    this._locals[this._read8()] = this._stack.pop();
    return done();
}

Frame.prototype.lstore = function(done) {
    this._locals[this._read8()] = this._stack.pop();
    return done();
}

Frame.prototype.fstore = function(done) {
    this._locals[this._read8()] = this._stack.pop();
    return done();
}

Frame.prototype.dstore = function(done) {
    this._locals[this._read8()] = this._stack.pop();
    return done();
}

Frame.prototype.astore = function(done) {
    this._locals[this._read8()] = this._stack.pop();
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
    var ref = this._stack.pop();                
    ref[idx] = val;
    return done();
}

Frame.prototype.lastore = function(done) {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[idx] = val;
    return done();
}

Frame.prototype.fastore = function(done) {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[idx] = val;
    return done();
}

Frame.prototype.dastore = function(done) {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[idx] = val;
    return done();
}

Frame.prototype.aastore = function(done) {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var ref = this._stack.pop();
    ref[idx] = val;
    return done();
}

Frame.prototype.bastore = function(done) {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[idx] = val;
    return done();
}

Frame.prototype.castore = function(done) {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[idx] = val;
    return done();
}

Frame.prototype.sastore = function(done) {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[idx] = val;
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
    this._locals[this._read8()] += this._read8();
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
    this._stack.push(val2 / val1);
    return done();
}

Frame.prototype.ldiv = function(done) {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 / val1);
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


Frame.prototype.anewarray = function(done) {
    var idx = this._read16();
    var className = this._get(this._get(idx).name_index).bytes;       
    var size = this._stack.pop();
    this._stack.push(new Array(size));
    return done();
}

Frame.prototype.arraylength = function(done) {
    var ref = this._stack.pop();
    this._stack.push(ref.length);
    return done();
}

Frame.prototype.if_icmpeq = function(done) {
    var jmp = this._ip - 1 + Helper.getSInt(this._read16());                                
    var ref1 = this._stack.pop();
    var ref2 = this._stack.pop();
    this._ip = ref1 === ref2 ? jmp : this._ip;
    return done();
}

Frame.prototype.if_icmpgt = function(done) {
    var jmp = this._ip - 1 + Helper.getSInt(this._read16());                                
    var ref1 = this._stack.pop();
    var ref2 = this._stack.pop();
    this._ip = ref1 < ref2 ? jmp : this._ip;
    return done();
}

Frame.prototype.if_icmple = function(done) {
    var jmp = this._ip - 1 + Helper.getSInt(this._read16());
    this._ip = this._stack.pop() >= this._stack.pop() ? jmp : this._ip;
    return done();
}

Frame.prototype.if_icmplt = function(done) {
    var jmp = this._ip - 1 + Helper.getSInt(this._read16());
    this._ip = this._stack.pop() > this._stack.pop() ? jmp : this._ip;
    return done();
}

Frame.prototype.if_icmpge = function(done) {
    var jmp = this._ip - 1 + Helper.getSInt(this._read16());                                
    var ref1 = this._stack.pop();
    var ref2 = this._stack.pop();
    this._ip = ref1 <= ref2 ? jmp : this._ip;
    return done();
}

Frame.prototype.ifne = function(done) {
    var jmp = this._ip - 1 + Helper.getSInt(this._read16());
    this._ip = this._stack.pop() !== 0 ? jmp : this._ip;
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
    this._ip += Helper.getSInt(this._read16()) - 1;
    return done();
}

Frame.prototype.goto_w = function(done) {
    this._ip += Helper.getSInt(this._read32()) - 1;
    return done();
}

Frame.prototype.ifnull = function(done) {
    var ref = this._stack.pop();
    if (!ref) {
        this._ip += Helper.getSInt(this._read16()) - 1;
    }
    return done();
}

Frame.prototype.ifnonnull = function(done) {
    var ref = this._stack.pop();
    if (!!ref) {
        this._ip += Helper.getSInt(this._read16()) - 1;
    }
    return done();
}

Frame.prototype.putfield = function(done) {
    var idx = this._read16();
    
    var fieldName = this._get(this._get(this._get(idx).name_and_type_index).name_index).bytes;    
    var val = this._stack.pop();
    var obj = this._stack.pop();
    obj[fieldName] = val;
    return done();
}

Frame.prototype.getfield = function(done) {    
    var idx = this._read16();
    
    var fieldName = this._get(this._get(this._get(idx).name_and_type_index).name_index).bytes;
    var obj = this._stack.pop();
    this._stack.push(obj[fieldName]);
    return done();
}


Frame.prototype.new = function(done) {
    var idx = this._read16();
    
    var className = this._get(this._get(idx).name_index).bytes;    
    this._stack.push(this._api.createNewObject(className));
    return done();
}

Frame.prototype.getstatic = function(done) {
    var idx = this._read16();
    
    var className = this._get(this._get(this._get(idx).class_index).name_index).bytes;
    var staticField = this._get(this._get(this._get(idx).name_and_type_index).name_index).bytes;
    
    this._stack.push(this._api.getStaticField(className, staticField));
    return done();
}

Frame.prototype.invokestatic = function(done) {
    var self = this;
    
    var idx = this._read16();
    
    var className = this._get(this._get(this._get(idx).class_index).name_index).bytes;
    var methodName = this._get(this._get(this._get(idx).name_and_type_index).name_index).bytes;
    var argsType = Signature.parse(this._get(this._get(this._get(idx).name_and_type_index).signature_index).bytes);
    

    var args = [];
    for (var i=0; i<argsType.IN.length; i++) {
        args.unshift(this._stack.pop());
    }
    
    var method = this._api.getMethod(className, methodName);
    
    if (method instanceof Frame) {
        method.run.call(method, args, function(res) {
            if (argsType.OUT.length != 0) {                        
               self._stack.push(res);
            }
            return done();
        });
    } else {
        process.nextTick(function() {
            var res = method.apply(null, args);
            if (argsType.OUT.length != 0) {                        
                self._stack.push(res);                        
            }
            return done();
        });
    }
}    


Frame.prototype.invokevirtual = function(done) {
    var self = this;
    
    var idx = this._read16();
    
    var className = this._get(this._get(this._get(idx).class_index).name_index).bytes;
    var methodName = this._get(this._get(this._get(idx).name_and_type_index).name_index).bytes;
    var argsType = Signature.parse(this._get(this._get(this._get(idx).name_and_type_index).signature_index).bytes);
    
    var args = [];
    for (var i=0; i<argsType.IN.length; i++) {
        args.unshift(this._stack.pop());
    }
    
    var instance = this._stack.pop();
    var object = this._api.createNewObject(className);
      
    if (object[methodName] instanceof Frame) {
        args.unshift(instance);
        object[methodName].run.call(instance[methodName], args, function(res) {
            if (argsType.OUT.length != 0) {                        
               self._stack.push(res);
            }
            return done();            
        });
    } else {
        process.nextTick(function() {
            var res = object[methodName].apply(instance, args);        
            if (argsType.OUT.length != 0) {
                self._stack.push(res);
            }
            return done();
        });
    }
}

Frame.prototype.invokespecial = function(done) {
    var self = this;
    
    var idx = this._read16();
    
    var className = this._get(this._get(this._get(idx).class_index).name_index).bytes;
    var methodName = this._get(this._get(this._get(idx).name_and_type_index).name_index).bytes;
    var argsType = Signature.parse(this._get(this._get(this._get(idx).name_and_type_index).signature_index).bytes);
    
    var args = [];
    for (var i=0; i<argsType.IN.length; i++) {
        args.unshift(this._stack.pop());
    }

    var instance = this._stack.pop();
    var ctor = this._api.createNewObject(className);
    
    if (ctor[methodName] instanceof Frame) {
        args.unshift(instance);
        ctor[methodName].run.call(instance[methodName], args, function() {
            return done();
        });
    } else {
        process.nextTick(function() {
            ctor[methodName].apply(instance, args);
            return done();
        });
    }
    
}

Frame.prototype.invokeinterface = function(done) {
    var self = this;
    
    var idx = this._read16();
    var argsNumber = this._read8();
    var zero = this._read8();
    
    var className = this._get(this._get(this._get(idx).class_index).name_index).bytes;
    var methodName = this._get(this._get(this._get(idx).name_and_type_index).name_index).bytes;
    var argsType = Signature.parse(this._get(this._get(this._get(idx).name_and_type_index).signature_index).bytes);
    
    var args = [];
    for (var i=0; i<argsType.IN.length; i++) {
        args.unshift(this._stack.pop());
    }

    var instance = this._stack.pop();
      
    if (instance[methodName] instanceof Frame) {
        args.unshift(instance);
        instance[methodName].run.call(instance[methodName], args, function(res) {
            if (argsType.OUT.length != 0) {                        
               self._stack.push(res);
            }
            return done();            
        });
    } else {
        process.nextTick(function() {
            var res = instance[methodName].apply(instance, args);
            if (argsType.OUT.length != 0) {
                self._stack.push(res);
            }
            return done();
        });
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
    var idx = this._read8();
    this._ip = this._locals[idx];
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
    
    this._ip = startip - 1 + Helper.getSInt(jmp);
    
    return done();
}

