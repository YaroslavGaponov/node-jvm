
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
                break;
            }
        }
        
        this._ip = 0;
        this._locals = new Array(4);
        this._stack = [];
        
        this._end = false;
        
    } else {
        return new Frame(api, classArea, method);
    }
}

Frame.prototype._read8 = function() {
    return this._code[this._ip++];
};

Frame.prototype._read16 = function() {
    return this._read8()<<8 | this._read8();
};

Frame.prototype._read32 = function() {
    return this._read16()<<16 | this._read16()();
};

Frame.prototype._get = function(index) {
    return this._classArea.getPoolConstant()[index];
}


Frame.prototype.run = function() {
    
    this._ip = 0;
    this._locals = new Array(4);
    this._stack = [];
    
    this._end = false;
    
    
    for(var i=0; i<arguments.length; i++) {
        this._locals[i] = arguments[i];
    }    
        
    var res = null;
    while(!this._end) {
        var opName = Opcodes.toString(this._read8());
        if (!this[opName]) {
            throw new Error(util.format("Opcode [%s] is not support. ", opcodeName));
        }
        res = this[opName]();        
    }
    return res;
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
    var indx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[indx]);                
}

Frame.prototype.laload = function() {
    var indx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[indx]);                
}

Frame.prototype.faload = function() {
    var indx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[indx]);                
}


Frame.prototype.daload = function() {
    var indx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[indx]);                
}

Frame.prototype.aaload = function() {
    var indx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[indx]);                
}

Frame.prototype.baload = function() {
    var indx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[indx]);                
}

Frame.prototype.caload = function() {
    var indx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[indx]);                
}

Frame.prototype.saload = function() {
    var indx = this._stack.pop();
    var refArray = this._stack.pop();
    this._stack.push(refArray[indx]);                
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
    var indx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[indx] = val;    
}

Frame.prototype.lastore = function() {
    var val = this._stack.pop();
    var indx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[indx] = val;    
}

Frame.prototype.fastore = function() {
    var val = this._stack.pop();
    var indx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[indx] = val;    
}

Frame.prototype.dastore = function() {
    var val = this._stack.pop();
    var indx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[indx] = val;    
}

Frame.prototype.aastore = function() {
    var val = this._stack.pop();
    var indx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[indx] = val;    
}

Frame.prototype.bastore = function() {
    var val = this._stack.pop();
    var indx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[indx] = val;    
}

Frame.prototype.castore = function() {
    var val = this._stack.pop();
    var indx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[indx] = val;    
}

Frame.prototype.sastore = function() {
    var val = this._stack.pop();
    var indx = this._stack.pop();                
    var ref = this._stack.pop();                
    ref[indx] = val;    
}

Frame.prototype.pop = function() {
    this._stack.pop();
}

Frame.prototype.pop2 = function() {
    this._stack.pop();
}

Frame.prototype.dup = function() {
    var ref = this._stack.pop();
    this._stack.push(ref);
    this._stack.push(ref);
}


Frame.prototype.new = function() {
    var className = this._get(this._get(this._read16()).name_index).bytes;    
    this._stack.push(this._api.createNewObject(className));
}

Frame.prototype.getstatic = function() {
    var staticField = this._get(this._read16());                
    var packageName = this._get(this._get(staticField.class_index).name_index).bytes;
    var className = this._get(this._get(staticField.name_and_type_index).name_index).bytes;                
    this._stack.push(require(util.format("%s/%s/%s.js", __dirname, packageName, className)));    
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

Frame.prototype.ireturn = function() {
    this._end = true;
    return this._stack.pop();
}
Frame.prototype.lreturn = function() {
    this._end = true;
    return this._stack.pop();
}

Frame.prototype.return = function() {
    this._end = true;
    return;
}


Frame.prototype.invokestatic = function() {
    var indx = this._read16();
    var className = this._get(this._get(this._get(indx).class_index).name_index).bytes;
    var methodName = this._get(this._get(this._get(indx).name_and_type_index).name_index).bytes;
    var argsType = Signature.parse(this._get(this._get(this._get(indx).name_and_type_index).signature_index).bytes);

    console.log();console.log("invokestatic: " + className + "." + methodName);console.log();
    
    var args = [];
    for (var i=0; i<argsType.IN.length; i++) {
        args.push(this._stack.pop());
    }

    var staticMethod = this._api.getStaticMethod(className, methodName);
   
    var res;
    
    if (staticMethod instanceof Frame) {
        res = staticMethod.run.apply(staticMethod, args.reverse());
    } else {        
        res = staticMethod.apply(null, args.reverse());
    }
    
    if (argsType.OUT.length != 0) {                        
        this._stack.push(res);                        
    }

}

Frame.prototype.invokevirtual = function() {
    var indx = this._read16();
    var className = this._get(this._get(this._get(indx).class_index).name_index).bytes;
    var methodName = this._get(this._get(this._get(indx).name_and_type_index).name_index).bytes;
    var argsType = Signature.parse(this._get(this._get(this._get(indx).name_and_type_index).signature_index).bytes);

    console.log();console.log("invokevirtual: " + className + "." + methodName);console.log();
    
    var args = [];
    for (var i=0; i<argsType.IN.length; i++) {
        args.push(this._stack.pop());
    }
    
    var obj = this._stack.pop();
    
    var res;
    
    if (obj[methodName] instanceof Frame) {    
        res = obj[methodName].run.apply(obj, args.reverse());
    } else {
        res = obj[methodName].apply(obj, args.reverse());
    }
    
    if (argsType.OUT.length != 0) {
        this._stack.push(res);
    }    
}


Frame.prototype.invokespecial = function() {
    var indx = this._read16();
    var className = this._get(this._get(this._get(indx).class_index).name_index).bytes;
    var methodName = this._get(this._get(this._get(indx).name_and_type_index).name_index).bytes;
    var argsType = Signature.parse(this._get(this._get(this._get(indx).name_and_type_index).signature_index).bytes);

    console.log();console.log("invokespecial: " + className + "." + methodName);console.log();
    
    var args = [];
    for (var i=0; i<argsType.IN.length; i++) {
        args.push(this._stack.pop());
    }
    
    var obj = this._stack.pop();    
    var res;
    
    if (obj[methodName] instanceof Frame) {
        console.log(obj);
        res = obj[methodName].run.apply(obj, args.reverse());
    } else {
        res = obj[methodName].apply(obj, args.reverse());
    }
    
    if (argsType.OUT.length != 0) {
        this._stack.push(res);
    }    
}




