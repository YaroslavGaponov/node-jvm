
var util = require("util");
var Opcodes = require("./opcodes.js");
var Helper = require("./util/helper.js");
var Signature = require("./classfile/signature.js");
var TAGS = require("./classfile/tags.js");
var ATTRIBUTE_TYPES = require("./classfile/attributetypes.js");

var Frame = module.exports = function(getNewFrame, classArea, method) {
    if (this instanceof Frame) {
        
        this.getNewFrame = getNewFrame;
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
        return new Frame(getNewFrame, classArea, method);
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

Frame.prototype.run = function() {
    
    for(var i=0; i<arguments.length; i++) {
        this.LOCALS[i] = arguments[i];
    }    
        
    while(true) {
        var cmd = this.read8();
        switch(cmd) {
            
            case Opcodes.nop:
                break;

            case Opcodes.aconst_null:
                this.STACK.push(null);
                break;
            
            case Opcodes.iconst_m1:
                this.STACK.push(-1);
                break;
            
            case Opcodes.iconst_0:
            case Opcodes.lconst_0:
            case Opcodes.fconst_0:
            case Opcodes.dconst_0:
                this.STACK.push(0);
                break;
            
            case Opcodes.iconst_1:
            case Opcodes.lconst_1:
            case Opcodes.fconst_1:
            case Opcodes.dconst_1:                
                this.STACK.push(1);
                break;
            
            case Opcodes.iconst_2:
            case Opcodes.fconst_2:
                this.STACK.push(2);
                break;
            
            case Opcodes.iconst_3:
                this.STACK.push(4);
                break;
            
            case Opcodes.iconst_4:
                this.STACK.push(4);
                break;
            
            case Opcodes.iconst_5:
                this.STACK.push(5);
                break;
            
            case Opcodes.sipush:
                this.STACK.push(this.read16());
                break;
            
            case Opcodes.bipush:
                this.STACK.push(this.read8());
                break;
            
            case Opcodes.ldc:
                var constant = this.getConstant(this.read8());
                switch(constant.tag) {
                    case TAGS.CONSTANT_String:                        
                        this.STACK.push(this.getConstant(constant.string_index).bytes);
                        break;
                    default:
                        throw new Error("not support constant type");
                }
                break;
            
            case Opcodes.ldc_w:
            case Opcodes.ldc2_w:
                var constant = this.getConstant(this.read16());
                switch(constant.tag) {
                    case TAGS.CONSTANT_String:                        
                        this.STACK.push(this.getConstant(constant.string_index).bytes);
                        break;
                    default:
                        throw new Error("not support constant type");
                }
                break;

            case Opcodes.iload:
            case Opcodes.lload:
            case Opcodes.fload:
            case Opcodes.dload:
            case Opcodes.aload:
                this.STACK.push(this.LOCALS[this.read8()]);
                break;
                
            case Opcodes.iload_0:
            case Opcodes.lload_0:
            case Opcodes.fload_0:
            case Opcodes.dload_0:
            case Opcodes.aload_0:
                this.STACK.push(this.LOCALS[0]);
                break;
            
            case Opcodes.iload_1:
            case Opcodes.lload_1:
            case Opcodes.fload_1:
            case Opcodes.dload_1:
            case Opcodes.aload_1:            
                this.STACK.push(this.LOCALS[1]);
                break;
            
            case Opcodes.iload_2:
            case Opcodes.lload_2:
            case Opcodes.fload_2:
            case Opcodes.dload_2:
            case Opcodes.aload_2:                
                this.STACK.push(this.LOCALS[2]);
                break;
            
            case Opcodes.iload_3:
            case Opcodes.lload_3:
            case Opcodes.fload_3:
            case Opcodes.dload_3:
            case Opcodes.aload_3:
                this.STACK.push(this.LOCALS[3]);
                break;
                
            case Opcodes.iaload:
            case Opcodes.laload:
            case Opcodes.faload:
            case Opcodes.daload:
            case Opcodes.aaload:
            case Opcodes.baload:
            case Opcodes.caload:
            case Opcodes.saload:
                var indx = this.STACK.pop();
                var refArray = this.STACK.pop();
                this.STACK.push(refArray[indx]);                
                break;

            case Opcodes.istore:
            case Opcodes.lstore:
            case Opcodes.fstore:
            case Opcodes.dstore:
            case Opcodes.astore:
                this.LOCALS[this.read8()] = this.STACK.pop();
                break;
            
            case Opcodes.istore_0:
            case Opcodes.lstore_0:
            case Opcodes.fstore_0:
            case Opcodes.dstore_0:
            case Opcodes.astore_0:
                this.LOCALS[0] = this.STACK.pop();
                break;
            
            case Opcodes.istore_1:
            case Opcodes.lstore_1:
            case Opcodes.fstore_1:
            case Opcodes.dstore_1:
            case Opcodes.astore_1:                
                this.LOCALS[1] = this.STACK.pop();
                break;
            
            case Opcodes.istore_2:
            case Opcodes.lstore_2:
            case Opcodes.fstore_2:
            case Opcodes.dstore_2:
            case Opcodes.astore_2:                
                this.LOCALS[2] = this.STACK.pop();
                break;
            
            case Opcodes.istore_3:
            case Opcodes.lstore_3:
            case Opcodes.fstore_3:
            case Opcodes.dstore_3:
            case Opcodes.astore_3:                
                this.LOCALS[3] = this.STACK.pop();
                break;

            case Opcodes.iastore:
            case Opcodes.lastore:
            case Opcodes.fastore:
            case Opcodes.dastore:
            case Opcodes.aastore:
            case Opcodes.bastore:
            case Opcodes.castore:
            case Opcodes.sastore:
                var val = this.STACK.pop();
                var indx = this.STACK.pop();                
                var ref = this.STACK.pop();                
                ref[indx] = val;
                break;

            case Opcodes.pop:
            case Opcodes.pop2:
                this.STACK.pop();
                break;
            
            case Opcodes.dup:
                var ref = this.STACK.pop();
                this.STACK.push(ref);
                this.STACK.push(ref);
                break;
            
            case Opcodes.new:
                var className = this.getConstant(this.getConstant(this.read16()).name_index).bytes;
                var ctor = require(util.format("%s/%s.js", __dirname, className));
                this.STACK.push(new ctor());
                break;
            
            case Opcodes.getstatic:
                var staticField = this.getConstant(this.read16());                
                var packageName = this.getConstant(this.getConstant(staticField.class_index).name_index).bytes;
                var className = this.getConstant(this.getConstant(staticField.name_and_type_index).name_index).bytes;                
                this.STACK.push(require(util.format("%s/%s/%s.js", __dirname, packageName, className)));
                break;
            
            case Opcodes.invokestatic:
                var staticMethod = this.getConstant(this.read16());
                var packageClassName = this.getConstant(this.getConstant(staticMethod.class_index).name_index).bytes;
                var method = this.getConstant(this.getConstant(staticMethod.name_and_type_index).name_index).bytes;                
                var argsType = Signature.parse(this.getConstant(this.getConstant(staticMethod.name_and_type_index).signature_index).bytes);
                
                var args = [];
                for (var i=0; i<argsType.IN.length; i++) {
                    args.push(this.STACK.pop());
                }

                var aNewFrame = this.getNewFrame(packageClassName, method);
                
                if (aNewFrame) {                    
                    var res = aNewFrame.run.apply(aNewFrame, args);
                    if (argsType.OUT.length != 0) {                        
                        this.STACK.push(res);                        
                    }
                } else {
                    var ctor = require(util.format("%s/%s.js", __dirname, packageClassName));
                    var res = ctor[method].apply(null, args.reverse());
                    if (argsType.OUT.length != 0) {
                        this.STACK.push(res);
                    }
                }
                break;
            
            case Opcodes.invokevirtual:
                var methodRefIndex = this.read16();
                var methodName = this.getConstant(this.getConstant(this.getConstant(methodRefIndex).name_and_type_index).name_index).bytes;
                var argsType = Signature.parse(this.getConstant(this.getConstant(this.getConstant(methodRefIndex).name_and_type_index).signature_index).bytes);
                
                var args = [];
                for (var i=0; i<argsType.IN.length; i++) {
                    args.push(this.STACK.pop());
                }
                
                var obj = this.STACK.pop();
                var res = obj[methodName].apply(obj, args.reverse());
                if (argsType.OUT.length != 0) {
                    this.STACK.push(res);
                }
                break;
            
            case Opcodes.invokespecial:
                var methodRefIndex = this.read16();
                var methodName = this.getConstant(this.getConstant(this.getConstant(methodRefIndex).name_and_type_index).name_index).bytes;
                var argsType = Signature.parse(this.getConstant(this.getConstant(this.getConstant(methodRefIndex).name_and_type_index).signature_index).bytes);
                
                var args = [];
                for (var i=0; i<argsType.IN.length; i++) {
                    args.push(this.STACK.pop());
                }
                
                var obj = this.STACK.pop();
                var res = obj[methodName].apply(obj, args.reverse());
                if (argsType.OUT.length != 0) {
                    this.STACK.push(res);
                }
                break;
            
            case Opcodes.iinc:
                this.LOCALS[this.read8()] += this.read8();
                break;
            
            case Opcodes.iadd:
            case Opcodes.ladd:
            case Opcodes.dadd:
            case Opcodes.fadd:
                this.STACK.push(this.STACK.pop() + this.STACK.pop());
                break;
            
            case Opcodes.isub:
            case Opcodes.lsub:
            case Opcodes.dsub:
            case Opcodes.fsub:
                this.STACK.push(- this.STACK.pop() + this.STACK.pop());
                break;

            case Opcodes.anewarray:
                var type = this.read16();
                var size = this.STACK.pop();
                this.STACK.push(new Array(size));                
                break;
            
            case Opcodes.arraylength:
                var ref = this.STACK.pop();
                this.STACK.push(ref.length);
                break;
            
            case Opcodes.if_icmpeq:
                var jmp = this.IP - 1 + Helper.getSInt(this.read16());                                
                var ref1 = this.STACK.pop();
                var ref2 = this.STACK.pop();
                this.IP = ref1 === ref2 ? jmp : this.IP;
                break;
            
            case Opcodes.if_icmpgt:
                var jmp = this.IP - 1 + Helper.getSInt(this.read16());                                
                var ref1 = this.STACK.pop();
                var ref2 = this.STACK.pop();
                this.IP = ref1 < ref2 ? jmp : this.IP;                
                break;
            
            case Opcodes.ifne:
                var jmp = this.IP - 1 + Helper.getSInt(this.read16());
                this.IP = this.STACK.pop() !== 0 ? jmp : this.IP;
                break;
            
            case Opcodes.if_icmple:
                var jmp = this.IP - 1 + Helper.getSInt(this.read16());
                this.IP = this.STACK.pop() >= this.STACK.pop() ? jmp : this.IP;
                break;
            
            case Opcodes.if_icmplt:
                var jmp = this.IP - 1 + Helper.getSInt(this.read16());
                this.IP = this.STACK.pop() > this.STACK.pop() ? jmp : this.IP;
                break;
            
            
            case Opcodes.i2l:
            case Opcodes.i2f:
            case Opcodes.i2d:
            case Opcodes.i2b:
            case Opcodes.i2c:
            case Opcodes.i2s:                
            case Opcodes.l2i:
            case Opcodes.l2d:
            case Opcodes.l2f:                
            case Opcodes.d2i:
            case Opcodes.d2l:
            case Opcodes.d2f:                
            case Opcodes.f2d:
            case Opcodes.f2i:
            case Opcodes.f2l:            
                break;
            
            case Opcodes.goto:                
                this.IP += Helper.getSInt(this.read16()) - 1;
                break;
            
            case Opcodes.ireturn:
            case Opcodes.lreturn:
                return this.STACK.pop();
            
            case Opcodes.return:
                return;
                
            default:                
                throw new Error(util.format("Command '%s' [0x%s] is not supported.", Opcodes.toString(cmd), cmd.toString(16)));
        }
    }    
};





