
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

Frame.prototype.runAsync = function(cb) {
    var self = this;
    
    var args =  Array.prototype.slice.call(arguments).slice(1);

    this._ip = 0;
    this._stack = [];
    this._locals = new Array(this._max_locals);
    for(var i=0; i<args.length; i++) {
        this._locals[i] = args[i];
    }
    
    var id = setInterval(function() {
            var opCode = self._read8()
            
            switch(opCode) {
                case Opcodes.return:
                   clearInterval(id);
                   return cb();
                case Opcodes.ireturn:
                case Opcodes.lreturn:
                case Opcodes.freturn:
                case Opcodes.dreturn:
                case Opcodes.areturn:
                     clearInterval(id);
                    return cb(self._stack.pop());
            }
    
            var opName = Opcodes.toString(opCode);
            
            if (!self[opName]) {
                throw new Error(util.format("Opcode %s [%s] is not support.", opName, opCode));
            }
            
            self[opName]();

    }, 0);
}

Frame.prototype.run = function() {
    
    this._ip = 0;
    this._stack = [];
    this._locals = new Array(this._max_locals);
    for(var i=0; i<arguments.length; i++) {
        this._locals[i] = arguments[i];
    }    
        
    while (true) {
        var opCode = this._read8()
        
        switch(opCode) {
            case Opcodes.return:
                return;
            case Opcodes.ireturn:
            case Opcodes.lreturn:
            case Opcodes.freturn:
            case Opcodes.dreturn:
            case Opcodes.areturn:
                return this._stack.pop();
        }

        var opName = Opcodes.toString(opCode);
        
        if (!this[opName]) {
            throw new Error(util.format("Opcode %s [%s] is not support.", opName, opCode));
        }
        
        this[opName]();
    }
    
};



Frame.prototype.nop = function() {    
}

Frame.prototype.aconst_null = function() {
    this._stack.push(null);
}

Frame.prototype.iconst_m1 = function() {
    this._stack.push(-1);
}

Frame.prototype.iconst_0 = function() {
    this._stack.push(0);    
}

Frame.prototype.lconst_0 = function() {
    this._stack.push(0);    
}

Frame.prototype.fconst_0 = function() {
    this._stack.push(0);    
}

Frame.prototype.dconst_0 = function() {
    this._stack.push(0);    
}

Frame.prototype.iconst_1 = function() {
    this._stack.push(1);    
}

Frame.prototype.lconst_1 = function() {
    this._stack.push(1);    
}

Frame.prototype.fconst_1 = function() {
    this._stack.push(1);    
}

Frame.prototype.dconst_1 = function() {
    this._stack.push(1);    
}

Frame.prototype.iconst_2 = function() {
    this._stack.push(2);    
}

Frame.prototype.fconst_2 = function() {
    this._stack.push(2);    
}

Frame.prototype.iconst_3 = function() {
    this._stack.push(3);    
}

Frame.prototype.iconst_4 = function() {
    this._stack.push(4);    
}
Frame.prototype.iconst_4 = function() {
    this._stack.push(5);    
}

Frame.prototype.iconst_5 = function() {
    this._stack.push(5);    
}

Frame.prototype.sipush = function() {
    this._stack.push(this._read16());
}

Frame.prototype.bipush = function() {
    this._stack.push(this._read8());
}

Frame.prototype.ldc = function() {
    var constant = this._get(this._read8());
    switch(constant.tag) {
        case TAGS.CONSTANT_String:                        
            this._stack.push(this._get(constant.string_index).bytes);
            break;
        default:
            throw new Error("not support constant type");
    }
}

Frame.prototype.ldc_w = function() {
    var constant = this._get(this._read16());
    switch(constant.tag) {
        case TAGS.CONSTANT_String:                        
            this._stack.push(this._get(constant.string_index).bytes);
            break;
        default:
            throw new Error("not support constant type");
    }    
}

Frame.prototype.ldc2_w = function() {
    var constant = this._get(this._read16());
    switch(constant.tag) {
        case TAGS.CONSTANT_String:                        
            this._stack.push(this._get(constant.string_index).bytes);
            break;
        default:
            throw new Error("not support constant type");
    }    
}

Frame.prototype.iload = function() {
    this._stack.push(this._locals[this._read8()]);
}

Frame.prototype.lload = function() {
    this._stack.push(this._locals[this._read8()]);
}

Frame.prototype.fload = function() {
    this._stack.push(this._locals[this._read8()]);
}

Frame.prototype.dload = function() {
    this._stack.push(this._locals[this._read8()]);
}

Frame.prototype.aload = function() {
    this._stack.push(this._locals[this._read8()]);
}

Frame.prototype.iload_0 = function() {
    this._stack.push(this._locals[0]);
}

Frame.prototype.lload_0 = function() {
    this._stack.push(this._locals[0]);
}

Frame.prototype.fload_0 = function() {
    this._stack.push(this._locals[0]);
}

Frame.prototype.fload_0 = function() {
    this._stack.push(this._locals[0]);
}

Frame.prototype.dload_0 = function() {
    this._stack.push(this._locals[0]);
}

Frame.prototype.aload_0 = function() {
    this._stack.push(this._locals[0]);
}

Frame.prototype.iload_1 = function() {
    this._stack.push(this._locals[1]);
}

Frame.prototype.lload_1 = function() {
    this._stack.push(this._locals[1]);
}

Frame.prototype.fload_1 = function() {
    this._stack.push(this._locals[1]);
}

Frame.prototype.fload_1 = function() {
    this._stack.push(this._locals[1]);
}

Frame.prototype.dload_1 = function() {
    this._stack.push(this._locals[1]);
}

Frame.prototype.aload_1 = function() {
    this._stack.push(this._locals[1]);
}

Frame.prototype.iload_2 = function() {
    this._stack.push(this._locals[2]);
}

Frame.prototype.lload_2 = function() {
    this._stack.push(this._locals[2]);
}

Frame.prototype.fload_2 = function() {
    this._stack.push(this._locals[2]);
}

Frame.prototype.fload_2 = function() {
    this._stack.push(this._locals[2]);
}

Frame.prototype.dload_2 = function() {
    this._stack.push(this._locals[2]);
}

Frame.prototype.aload_2 = function() {
    this._stack.push(this._locals[2]);
}

Frame.prototype.iload_3 = function() {
    this._stack.push(this._locals[3]);
}

Frame.prototype.lload_3 = function() {
    this._stack.push(this._locals[3]);
}

Frame.prototype.fload_3 = function() {
    this._stack.push(this._locals[3]);
}

Frame.prototype.fload_3 = function() {
    this._stack.push(this._locals[3]);
}

Frame.prototype.dload_3 = function() {
    this._stack.push(this._locals[3]);
}

Frame.prototype.aload_3 = function() {
    this._stack.push(this._locals[3]);
}

Frame.prototype.iaload = function() {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[idx]);                
}

Frame.prototype.laload = function() {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[idx]);                
}

Frame.prototype.faload = function() {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[idx]);                
}


Frame.prototype.daload = function() {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[idx]);                
}

Frame.prototype.aaload = function() {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[idx]);                
}

Frame.prototype.baload = function() {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[idx]);                
}

Frame.prototype.caload = function() {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[idx]);                
}

Frame.prototype.saload = function() {
    var idx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[idx]);                
}

Frame.prototype.istore = function() {
    this._locals[this._read8()] = this._stack.pop();
}

Frame.prototype.lstore = function() {
    this._locals[this._read8()] = this._stack.pop();
}

Frame.prototype.fstore = function() {
    this._locals[this._read8()] = this._stack.pop();
}

Frame.prototype.dstore = function() {
    this._locals[this._read8()] = this._stack.pop();
}

Frame.prototype.astore = function() {
    this._locals[this._read8()] = this._stack.pop();
}

Frame.prototype.istore_0 = function() {
    this._locals[0] = this._stack.pop();    
}

Frame.prototype.lstore_0 = function() {
    this._locals[0] = this._stack.pop();    
}

Frame.prototype.fstore_0 = function() {
    this._locals[0] = this._stack.pop();    
}

Frame.prototype.dstore_0 = function() {
    this._locals[0] = this._stack.pop();    
}

Frame.prototype.astore_0 = function() {
    this._locals[0] = this._stack.pop();    
}

Frame.prototype.istore_1 = function() {
    this._locals[1] = this._stack.pop();    
}

Frame.prototype.lstore_1 = function() {
    this._locals[1] = this._stack.pop();    
}

Frame.prototype.fstore_1 = function() {
    this._locals[1] = this._stack.pop();    
}

Frame.prototype.dstore_1 = function() {
    this._locals[1] = this._stack.pop();    
}

Frame.prototype.astore_1 = function() {
    this._locals[1] = this._stack.pop();
}


Frame.prototype.istore_2 = function() {
    this._locals[2] = this._stack.pop();    
}

Frame.prototype.lstore_2 = function() {
    this._locals[2] = this._stack.pop();    
}

Frame.prototype.fstore_2 = function() {
    this._locals[2] = this._stack.pop();    
}

Frame.prototype.dstore_2 = function() {
    this._locals[2] = this._stack.pop();    
}

Frame.prototype.astore_2 = function() {
    this._locals[2] = this._stack.pop();    
}

Frame.prototype.istore_3 = function() {
    this._locals[3] = this._stack.pop();    
}

Frame.prototype.lstore_3 = function() {
    this._locals[3] = this._stack.pop();    
}

Frame.prototype.fstore_3 = function() {
    this._locals[3] = this._stack.pop();    
}

Frame.prototype.dstore_3 = function() {
    this._locals[3] = this._stack.pop();    
}

Frame.prototype.astore_3 = function() {
    this._locals[3] = this._stack.pop();    
}

Frame.prototype.iastore = function() {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[idx] = val;    
}

Frame.prototype.lastore = function() {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[idx] = val;    
}

Frame.prototype.fastore = function() {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[idx] = val;    
}

Frame.prototype.dastore = function() {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[idx] = val;    
}

Frame.prototype.aastore = function() {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[idx] = val;    
}

Frame.prototype.bastore = function() {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[idx] = val;    
}

Frame.prototype.castore = function() {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[idx] = val;    
}

Frame.prototype.sastore = function() {
    var val = this._stack.pop();
    var idx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[idx] = val;    
}

Frame.prototype.pop = function() {
    this._stack.pop();
}

Frame.prototype.pop2 = function() {
    this._stack.pop();
}

Frame.prototype.dup = function() {
    var val = this._stack.pop();
    this._stack.push(val);
    this._stack.push(val);
}

Frame.prototype.dup_x1 = function() {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val1);
    this._stack.push(val2);
    this._stack.push(val1);
}

Frame.prototype.dup_x2 = function() {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    var val3 = this._stack.pop();    
    this._stack.push(val1);
    this._stack.push(val3);
    this._stack.push(val2);    
    this._stack.push(val1);
}

Frame.prototype.dup2 = function() {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2);
    this._stack.push(val1);
    this._stack.push(val2);
    this._stack.push(val1);    
}

Frame.prototype.dup2_x1 = function() {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    var val3 = this._stack.pop();
    this._stack.push(val2);
    this._stack.push(val1);
    this._stack.push(val3);
    this._stack.push(val2);
    this._stack.push(val1);
}

Frame.prototype.dup2_x2 = function() {
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
}


Frame.prototype.swat = function() {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val1);
    this._stack.push(val2);
}


Frame.prototype.iinc = function() {
    this._locals[this._read8()] += this._read8();    
}

Frame.prototype.iadd = function() {
    this._stack.push(this._stack.pop() + this._stack.pop());    
}

Frame.prototype.ladd = function() {
    this._stack.push(this._stack.pop() + this._stack.pop());    
}

Frame.prototype.dadd = function() {
    this._stack.push(this._stack.pop() + this._stack.pop());    
}

Frame.prototype.fadd = function() {
    this._stack.push(this._stack.pop() + this._stack.pop());    
}

Frame.prototype.isub = function() {
    this._stack.push(- this._stack.pop() + this._stack.pop());    
}

Frame.prototype.lsub = function() {
    this._stack.push(- this._stack.pop() + this._stack.pop());    
}

Frame.prototype.dsub = function() {
    this._stack.push(- this._stack.pop() + this._stack.pop());    
}

Frame.prototype.fsub = function() {
    this._stack.push(- this._stack.pop() + this._stack.pop());    
}

Frame.prototype.imul = function() {
    this._stack.push(this._stack.pop() * this._stack.pop());    
}

Frame.prototype.lmul = function() {
    this._stack.push(this._stack.pop() * this._stack.pop());    
}

Frame.prototype.dmul = function() {
    this._stack.push(this._stack.pop() * this._stack.pop());    
}

Frame.prototype.fmul = function() {
    this._stack.push(this._stack.pop() * this._stack.pop());    
}

Frame.prototype.idiv = function() {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 / val1);    
}

Frame.prototype.ldiv = function() {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 / val1);    
}

Frame.prototype.ddiv = function() {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 / val1);    
}

Frame.prototype.fdiv = function() {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 / val1);    
}

Frame.prototype.irem = function() {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 % val1);    
}

Frame.prototype.lrem = function() {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 % val1);    
}

Frame.prototype.drem = function() {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 % val1);    
}

Frame.prototype.frem = function() {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 % val1);    
}

Frame.prototype.ineg = function() {
    this._stack.push(- this._stack.pop());    
}

Frame.prototype.lneg = function() {
    this._stack.push(- this._stack.pop());    
}

Frame.prototype.dneg = function() {
    this._stack.push(- this._stack.pop());    
}

Frame.prototype.fneg = function() {
    this._stack.push(- this._stack.pop());    
}

Frame.prototype.ishl = function() {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 << val1);    
}

Frame.prototype.lshl = function() {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 << val1);    
}

Frame.prototype.ishr = function() {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 >> val1);    
}

Frame.prototype.lshr = function() {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 >> val1);    
}

Frame.prototype.iushr = function() {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 >>> val1);    
}

Frame.prototype.lushr = function() {
    var val1 = this._stack.pop();
    var val2 = this._stack.pop();
    this._stack.push(val2 >>> val1);    
}

Frame.prototype.iand = function() {
    this._stack.push(this._stack.pop() & this._stack.pop());    
}

Frame.prototype.land = function() {
    this._stack.push(this._stack.pop() & this._stack.pop());    
}

Frame.prototype.ior = function() {
    this._stack.push(this._stack.pop() | this._stack.pop());    
}

Frame.prototype.lor = function() {
    this._stack.push(this._stack.pop() | this._stack.pop());    
}

Frame.prototype.ixor = function() {
    this._stack.push(this._stack.pop() ^ this._stack.pop());    
}

Frame.prototype.lxor = function() {
    this._stack.push(this._stack.pop() ^ this._stack.pop());    
}


Frame.prototype.anewarray = function() {
    var type = this._read16();
    var size = this._stack.pop();
    this._stack.push(new Array(size));                    
}

Frame.prototype.arraylength = function() {
    var ref = this._stack.pop();
    this._stack.push(ref.length);    
}

Frame.prototype.if_icmpeq = function() {
    var jmp = this._ip - 1 + Helper.getSInt(this._read16());                                
    var ref1 = this._stack.pop();
    var ref2 = this._stack.pop();
    this._ip = ref1 === ref2 ? jmp : this._ip;    
}

Frame.prototype.if_icmpgt = function() {
    var jmp = this._ip - 1 + Helper.getSInt(this._read16());                                
    var ref1 = this._stack.pop();
    var ref2 = this._stack.pop();
    this._ip = ref1 < ref2 ? jmp : this._ip;                    
}

Frame.prototype.if_icmple = function() {
    var jmp = this._ip - 1 + Helper.getSInt(this._read16());
    this._ip = this._stack.pop() >= this._stack.pop() ? jmp : this._ip;    
}

Frame.prototype.if_icmplt = function() {
    var jmp = this._ip - 1 + Helper.getSInt(this._read16());
    this._ip = this._stack.pop() > this._stack.pop() ? jmp : this._ip;    
}

Frame.prototype.if_icmpge = function() {
    var jmp = this._ip - 1 + Helper.getSInt(this._read16());                                
    var ref1 = this._stack.pop();
    var ref2 = this._stack.pop();
    this._ip = ref1 <= ref2 ? jmp : this._ip;       
}

Frame.prototype.ifne = function() {
    var jmp = this._ip - 1 + Helper.getSInt(this._read16());
    this._ip = this._stack.pop() !== 0 ? jmp : this._ip;    
}

Frame.prototype.i2l = function() {    
}

Frame.prototype.i2f = function() {    
}

Frame.prototype.i2d = function() {    
}

Frame.prototype.i2b = function() {    
}

Frame.prototype.i2c = function() {    
}

Frame.prototype.i2s = function() {    
}

Frame.prototype.l2i = function() {    
}

Frame.prototype.l2d = function() {    
}

Frame.prototype.l2f = function() {    
}

Frame.prototype.d2i = function() {    
}

Frame.prototype.d2l = function() {    
}

Frame.prototype.d2f = function() {    
}

Frame.prototype.f2d = function() {    
}

Frame.prototype.f2i = function() {    
}

Frame.prototype.f2l = function() {    
}

Frame.prototype.goto = function() {
    this._ip += Helper.getSInt(this._read16()) - 1;    
}

Frame.prototype.goto_W = function() {
    this._ip += Helper.getSInt(this._read32()) - 1;    
}

Frame.prototype.ifnull = function() {
    var ref = this._stack.pop();
    if (!ref) {
        this._ip += Helper.getSInt(this._read16()) - 1;
    }
}

Frame.prototype.ifnonnull = function() {
    var ref = this._stack.pop();
    if (!!ref) {
        this._ip += Helper.getSInt(this._read16()) - 1;
    }
}

Frame.prototype.putfield = function() {
    var idx = this._read16();
    
    var fieldName = this._get(this._get(this._get(idx).name_and_type_index).name_index).bytes;    
    var val = this._stack.pop();
    var obj = this._stack.pop();
    obj[fieldName] = val;
}

Frame.prototype.getfield = function() {    
    var idx = this._read16();
    
    var fieldName = this._get(this._get(this._get(idx).name_and_type_index).name_index).bytes;
    var obj = this._stack.pop();
    this._stack.push(obj[fieldName]);    
}


Frame.prototype.new = function() {
    var idx = this._read16();
    
    var className = this._get(this._get(idx).name_index).bytes;    
    this._stack.push(this._api.createNewObject(className));
}

Frame.prototype.getstatic = function() {
    var idx = this._read16();
    
    var className = this._get(this._get(this._get(idx).class_index).name_index).bytes;
    var staticField = this._get(this._get(this._get(idx).name_and_type_index).name_index).bytes;
    
    this._stack.push(this._api.getStaticField(className, staticField));    
}

Frame.prototype.invokestatic = function() {
    var idx = this._read16();
    
    var className = this._get(this._get(this._get(idx).class_index).name_index).bytes;
    var methodName = this._get(this._get(this._get(idx).name_and_type_index).name_index).bytes;
    var argsType = Signature.parse(this._get(this._get(this._get(idx).name_and_type_index).signature_index).bytes);
    

    var args = [];
    for (var i=0; i<argsType.IN.length; i++) {
        args.unshift(this._stack.pop());
    }
    
    var method = this._api.getMethod(className, methodName);
   
    var res = null;    
    if (method instanceof Frame) {
        res = method.run.apply(method, args);
    } else {
        res = method.apply(null, args);
    }
    
    if (argsType.OUT.length != 0) {                        
        this._stack.push(res);                        
    }
}

Frame.prototype.invokevirtual = function() {
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
    
    var res = null;    
    if (object[methodName] instanceof Frame) {
        args.unshift(instance);
        res = object[methodName].run.apply(instance[methodName], args);
    } else {
        res = object[methodName].apply(instance, args);
    }
        
    if (argsType.OUT.length != 0) {
        this._stack.push(res);
    }    
}

Frame.prototype.invokespecial = function() {
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
        ctor[methodName].run.apply(instance[methodName], args);
    } else {        
        ctor[methodName].apply(instance, args);
    }
    
    this._stack.push(instance);    
}


Frame.prototype.invokeinterface = function() {
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
    
    var res = null;    
    if (instance[methodName] instanceof Frame) {
        args.unshift(instance);
        res = instance[methodName].run.apply(instance[methodName], args);
    } else {
        res = instance[methodName].apply(instance, args);
    }
        
    if (argsType.OUT.length != 0) {
        this._stack.push(res);
    }     
}

Frame.prototype.jsr = function() {
    var jmp = this._read16();
    this._stack.push(this._ip);
    this._ip = jmp;
}

Frame.prototype.jsr_w = function() {
    var jmp = this._read32();
    this._stack.push(this._ip);
    this._ip = jmp;
}

Frame.prototype.ret = function() {
    var idx = this._read8();
    this._ip = this._locals[idx];
}

Frame.prototype.tableswitch = function() {

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
    
}

