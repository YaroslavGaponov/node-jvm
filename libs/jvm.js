
var util = require("util");
var fs = require("fs");

var Opcodes = require("./opcodes.js");
var Helper = require("./util/helper.js");
var ClassArea = require("./classfile/classarea.js");
var Frame = require("./frame.js");
var Signature = require("./classfile/signature.js");
var TAGS = require("./classfile/tags.js");
var ACCESS_FLAGS = require("./classfile/accessflags.js");


var JVM = module.exports = function(entryPoint) {
    if (this instanceof JVM) {
        this.classes = {};
        this.frames = [];        
        this.entryPoint = {
            className: entryPoint ? entryPoint.className || null : null,
            methodName: entryPoint ? entryPoint.methodName || "main" : "main"
        };
    } else {
        return new JVM(entryPoint);
    }
}

JVM.prototype.loadClassFile = function(classFileName) {
    var bytes = fs.readFileSync(classFileName);
    var classArea = new ClassArea(bytes);
    this.classes[classArea.getClassName()] = classArea;
        
    if (!this.entryPoint.className || (this.entryPoint.className === classArea.getClassName())) {    
        if ((classArea.getAccessFlags() & ACCESS_FLAGS.ACC_PUBLIC) !== 0) {
            var methods = classArea.getMethods();
            var constantPool = classArea.getPoolConstant();
            for(var i=0; i<methods.length; i++) {
                if
                (
                    ((methods[i].access_flags & ACCESS_FLAGS.ACC_PUBLIC) !== 0) &&
                    ((methods[i].access_flags & ACCESS_FLAGS.ACC_STATIC) !== 0) &&
                    (constantPool[methods[i].name_index].bytes === this.entryPoint.methodName)
                )
                {
                    this.frames.push(new Frame(classArea, methods[i]));    
                }
            }
        }
    }
}

JVM.prototype.getNewFrame = function(className, method) {
    
    var classArea = this.classes[className];
    
    if (!classArea) {
        return null;
    }
    
    var methods = classArea.getMethods();
    var constantPool = classArea.getPoolConstant();
    for(var i=0; i<methods.length; i++) {
        if (constantPool[methods[i].name_index].bytes === method) {
            return new Frame(classArea, methods[i]);    
        }
    }    
}

JVM.prototype.run = function() {
        
    if (this.frames.length === 0) {
        throw new Error("Entry point class and method is not found.");
    }
    
    var frame = this.frames.pop();
    
    for(var i=0; i<arguments.length; i++) {
        frame.LOCALS[i] = arguments[i];
    }
        
    while(true) {
        var cmd = frame.read8();
        switch(cmd) {
            
            case Opcodes.nop:
                break;

            case Opcodes.aconst_null:
                frame.STACK.push(null);
                break;
            
            case Opcodes.iconst_m1:
                frame.STACK.push(-1);
                break;
            
            case Opcodes.iconst_0:
            case Opcodes.lconst_0:
            case Opcodes.fconst_0:
            case Opcodes.dconst_0:
                frame.STACK.push(0);
                break;
            
            case Opcodes.iconst_1:
            case Opcodes.lconst_1:
            case Opcodes.fconst_1:
            case Opcodes.dconst_1:                
                frame.STACK.push(1);
                break;
            
            case Opcodes.iconst_2:
            case Opcodes.fconst_2:
                frame.STACK.push(2);
                break;
            
            case Opcodes.iconst_3:
                frame.STACK.push(4);
                break;
            
            case Opcodes.iconst_4:
                frame.STACK.push(4);
                break;
            
            case Opcodes.iconst_5:
                frame.STACK.push(5);
                break;
            
            case Opcodes.sipush:
                frame.STACK.push(frame.read16());
                break;
            
            case Opcodes.bipush:
                frame.STACK.push(frame.read8());
                break;
            
            case Opcodes.ldc:
                var constant = frame.getConstant(frame.read8());
                switch(constant.tag) {
                    case TAGS.CONSTANT_String:                        
                        frame.STACK.push(frame.getConstant(constant.string_index).bytes);
                        break;
                    default:
                        throw new Error("not support constant type");
                }
                break;
            
            case Opcodes.ldc_w:
            case Opcodes.ldc2_w:
                var constant = frame.getConstant(frame.read16());
                switch(constant.tag) {
                    case TAGS.CONSTANT_String:                        
                        frame.STACK.push(frame.getConstant(constant.string_index).bytes);
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
                frame.STACK.push(frame.LOCALS[frame.read8()]);
                break;
                
            case Opcodes.iload_0:
            case Opcodes.lload_0:
            case Opcodes.fload_0:
            case Opcodes.dload_0:
            case Opcodes.aload_0:
                frame.STACK.push(frame.LOCALS[0]);
                break;
            
            case Opcodes.iload_1:
            case Opcodes.lload_1:
            case Opcodes.fload_1:
            case Opcodes.dload_1:
            case Opcodes.aload_1:            
                frame.STACK.push(frame.LOCALS[1]);
                break;
            
            case Opcodes.iload_2:
            case Opcodes.lload_2:
            case Opcodes.fload_2:
            case Opcodes.dload_2:
            case Opcodes.aload_2:                
                frame.STACK.push(frame.LOCALS[2]);
                break;
            
            case Opcodes.iload_3:
            case Opcodes.lload_3:
            case Opcodes.fload_3:
            case Opcodes.dload_3:
            case Opcodes.aload_3:
                frame.STACK.push(frame.LOCALS[3]);
                break;
                
            case Opcodes.iaload:
            case Opcodes.laload:
            case Opcodes.faload:
            case Opcodes.daload:
            case Opcodes.aaload:
            case Opcodes.baload:
            case Opcodes.caload:
            case Opcodes.saload:
                var indx = frame.STACK.pop();
                var refArray = frame.STACK.pop();
                frame.STACK.push(refArray[indx]);
                break;

            case Opcodes.istore:
            case Opcodes.lstore:
            case Opcodes.fstore:
            case Opcodes.dstore:
            case Opcodes.astore:
                frame.LOCALS[frame.read8()] = frame.STACK.pop();
                break;
            
            case Opcodes.istore_0:
            case Opcodes.lstore_0:
            case Opcodes.fstore_0:
            case Opcodes.dstore_0:
            case Opcodes.astore_0:
                frame.LOCALS[0] = frame.STACK.pop();
                break;
            
            case Opcodes.istore_1:
            case Opcodes.lstore_1:
            case Opcodes.fstore_1:
            case Opcodes.dstore_1:
            case Opcodes.astore_1:                
                frame.LOCALS[1] = frame.STACK.pop();
                break;
            
            case Opcodes.istore_2:
            case Opcodes.lstore_2:
            case Opcodes.fstore_2:
            case Opcodes.dstore_2:
            case Opcodes.astore_2:                
                frame.LOCALS[2] = frame.STACK.pop();
                break;
            
            case Opcodes.istore_3:
            case Opcodes.lstore_3:
            case Opcodes.fstore_3:
            case Opcodes.dstore_3:
            case Opcodes.astore_3:                
                frame.LOCALS[3] = frame.STACK.pop();
                break;

            case Opcodes.iastore:
            case Opcodes.lastore:
            case Opcodes.fastore:
            case Opcodes.dastore:
            case Opcodes.aastore:
            case Opcodes.bastore:
            case Opcodes.castore:
            case Opcodes.sastore:
                var val = frame.STACK.pop();
                var indx = frame.STACK.pop();                
                var ref = frame.STACK.pop();                
                ref[indx] = val;
                break;

            case Opcodes.pop:
            case Opcodes.pop2:
                frame.STACK.pop();
                break;
            
            case Opcodes.dup:
                var ref = frame.STACK.pop();
                frame.STACK.push(ref);
                frame.STACK.push(ref);
                break;
            
            case Opcodes.new:
                var className = frame.getConstant(frame.getConstant(frame.read16()).name_index).bytes;
                var ctor = require(util.format("%s/%s.js", __dirname, className));
                frame.STACK.push(new ctor());
                break;
            
            case Opcodes.getstatic:
                var staticField = frame.getConstant(frame.read16());                
                var packageName = frame.getConstant(frame.getConstant(staticField.class_index).name_index).bytes;
                var className = frame.getConstant(frame.getConstant(staticField.name_and_type_index).name_index).bytes;                
                frame.STACK.push(require(util.format("%s/%s/%s.js", __dirname, packageName, className)));
                break;
            
            case Opcodes.invokestatic:
                var staticMethod = frame.getConstant(frame.read16());
                var packageClassName = frame.getConstant(frame.getConstant(staticMethod.class_index).name_index).bytes;
                var method = frame.getConstant(frame.getConstant(staticMethod.name_and_type_index).name_index).bytes;                
                var argsType = Signature.parse(frame.getConstant(frame.getConstant(staticMethod.name_and_type_index).signature_index).bytes);
                
                var args = [];
                for (var i=0; i<argsType.IN.length; i++) {
                    args.push(frame.STACK.pop());
                }

                var aNewFrame = this.getNewFrame(packageClassName, method);
                
                if (aNewFrame) {                    
                    this.frames.push(frame);
                    frame = aNewFrame;
                    for(var i=0; i<args.length; i++) {
                        frame.LOCALS[i] = args[i];
                    }                    
                } else {                
                    var ctor = require(util.format("%s/%s.js", __dirname, packageClassName));
                    var res = ctor[method].apply(null, args.reverse());
                    if (argsType.OUT.length != 0) {
                        frame.STACK.push(res);
                    }
                }
                break;
            
            case Opcodes.invokevirtual:
                var methodRefIndex = frame.read16();
                var methodName = frame.getConstant(frame.getConstant(frame.getConstant(methodRefIndex).name_and_type_index).name_index).bytes;
                var argsType = Signature.parse(frame.getConstant(frame.getConstant(frame.getConstant(methodRefIndex).name_and_type_index).signature_index).bytes);
                
                var args = [];
                for (var i=0; i<argsType.IN.length; i++) {
                    args.push(frame.STACK.pop());
                }
                
                var obj = frame.STACK.pop();
                var res = obj[methodName].apply(obj, args.reverse());
                if (argsType.OUT.length != 0) {
                    frame.STACK.push(res);
                }
                break;
            
            case Opcodes.invokespecial:
                var methodRefIndex = frame.read16();
                var methodName = frame.getConstant(frame.getConstant(frame.getConstant(methodRefIndex).name_and_type_index).name_index).bytes;
                var argsType = Signature.parse(frame.getConstant(frame.getConstant(frame.getConstant(methodRefIndex).name_and_type_index).signature_index).bytes);
                
                var args = [];
                for (var i=0; i<argsType.IN.length; i++) {
                    args.push(frame.STACK.pop());
                }
                
                var obj = frame.STACK.pop();
                var res = obj[methodName].apply(obj, args.reverse());
                if (argsType.OUT.length != 0) {
                    frame.STACK.push(res);
                }
                break;
            
            case Opcodes.iinc:
                frame.LOCALS[frame.read8()] += frame.read8();
                break;
            
            case Opcodes.iadd:
            case Opcodes.ladd:
            case Opcodes.dadd:
            case Opcodes.fadd:
                frame.STACK.push(frame.STACK.pop() + frame.STACK.pop());
                break;
            
            case Opcodes.isub:
            case Opcodes.lsub:
            case Opcodes.dsub:
            case Opcodes.fsub:
                frame.STACK.push(- frame.STACK.pop() + frame.STACK.pop());
                break;

            case Opcodes.anewarray:
                var type = frame.read16();
                var size = frame.STACK.pop();
                frame.STACK.push(new Array(size));                
                break;
            
            case Opcodes.arraylength:
                var ref = frame.STACK.pop();
                frame.STACK.push(ref.length);
                break;
            
            case Opcodes.if_icmpeq:
                var jmp = frame.IP - 1 + Helper.getSInt(frame.read16());                                
                var ref1 = frame.STACK.pop();
                var ref2 = frame.STACK.pop();
                frame.IP = ref1 === ref2 ? jmp : frame.IP;
                break;
            
            case Opcodes.if_icmpgt:
                var jmp = frame.IP - 1 + Helper.getSInt(frame.read16());                                
                var ref1 = frame.STACK.pop();
                var ref2 = frame.STACK.pop();
                frame.IP = ref1 < ref2 ? jmp : frame.IP;                
                break;
            
            case Opcodes.ifne:
                var jmp = frame.IP - 1 + Helper.getSInt(frame.read16());
                frame.IP = frame.STACK.pop() !== 0 ? jmp : frame.IP;
                break;
            
            case Opcodes.if_icmple:
                var jmp = frame.IP - 1 + Helper.getSInt(frame.read16());
                frame.IP = frame.STACK.pop() >= frame.STACK.pop() ? jmp : frame.IP;
                break;
            
            case Opcodes.if_icmplt:
                var jmp = frame.IP - 1 + Helper.getSInt(frame.read16());
                frame.IP = frame.STACK.pop() > frame.STACK.pop() ? jmp : frame.IP;
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
                frame.IP += Helper.getSInt(frame.read16()) - 1;
                break;
            
            case Opcodes.ireturn:
            case Opcodes.lreturn:
                var result = frame.STACK.pop();
                frame = this.frames.pop();
                frame.STACK.push(result);
                break;
            
            case Opcodes.return:
                if (this.frames.length > 0) {
                    frame = this.frames.pop();
                } else {
                    process.exit();
                }
                
            default:                
                throw new Error(util.format("Command '%s' [0x%s] is not supported.", Opcodes.toString(cmd), cmd.toString(16)));
        }
    }
    
    
};

