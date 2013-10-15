
var util = require("util");
var fs = require("fs");

var Opcodes = require("./opcodes.js");
var Helper = require("./util/helper.js");
var ClassArea = require("./classfile/classarea.js");
var Frame = require("./frame.js");
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
    this.classes[classFileName] = classArea;
        
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


JVM.prototype.run = function() {
        
    if (this.frames.length === 0) {
        throw new Error("Entry point class and method is not found.");
    }
    
    var frame = this.frames.pop();
        
    while(true) {
        var cmd = frame.read8();
        switch(cmd) {
            case Opcodes.nop:
                break;            
            case Opcodes.getstatic:
                var staticField = frame.getConstant(frame.read16());                
                var packageName = frame.getConstant(frame.getConstant(staticField.class_index).name_index).bytes;
                var className = frame.getConstant(frame.getConstant(staticField.name_and_type_index).name_index).bytes;                
                frame.STACK.push(require(util.format("%s/%s/%s", __dirname, packageName, className)));
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

            case Opcodes.invokevirtual:                
                var methodRefIndex = frame.read16();
                var methodName = frame.getConstant(frame.getConstant(frame.getConstant(methodRefIndex).name_and_type_index).name_index).bytes;
                var paramType = frame.getConstant(frame.getConstant(frame.getConstant(methodRefIndex).name_and_type_index).signature_index).bytes;
                var args = [];
                switch (paramType) {
                    case "()V":
                        break;
                    case "(I)V":
                        args.push(frame.STACK.pop());
                        break;
                    case "(Ljava/lang/String;)V":
                        args.push(frame.STACK.pop());
                        break;
                    case "(Ljava/lang/String;[Ljava/lang/Object;)Ljava/io/PrintStream;":
                        args = frame.STACK.pop();
                        args.unshift(frame.STACK.pop());
                        break;
                    default:
                        throw new Error("Not support type " + paramType);
                    
                }
                frame.STACK.pop()[methodName].apply(null, args);                
                break;
            
            case Opcodes.iconst_0:
                frame.STACK.push(0);
                break;
            case Opcodes.iconst_1:
                frame.STACK.push(1);
                break;
            case Opcodes.iconst_2:
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
            
           case Opcodes.istore:
                frame.LOCALS[frame.read8()] = frame.STACK.pop();
                break;                        
           case Opcodes.istore_0:
                frame.LOCALS[0] = frame.STACK.pop();
                break;            
            case Opcodes.istore_1:
                frame.LOCALS[1] = frame.STACK.pop();
                break;
            case Opcodes.istore_2:
                frame.LOCALS[2] = frame.STACK.pop();
                break;
            case Opcodes.istore_3:
                frame.LOCALS[3] = frame.STACK.pop();
                break;
            
            case Opcodes.iload:
                frame.STACK.push(frame.LOCALS[frame.read8()]);
                break;                        
            case Opcodes.iload_0:
                frame.STACK.push(frame.LOCALS[0]);
                break;            
            case Opcodes.iload_1:
                frame.STACK.push(frame.LOCALS[1]);
                break;
            case Opcodes.iload_2:
                frame.STACK.push(frame.LOCALS[2]);
                break;
            case Opcodes.iload_3:
                frame.STACK.push(frame.LOCALS[3]);
                break;

            case Opcodes.lconst_0:
                frame.STACK.push(0);
                break;            
            case Opcodes.lconst_1:
                frame.STACK.push(1);
                break;
            
            case Opcodes.sipush:
                frame.STACK.push(frame.read16());
                break;            
            case Opcodes.bipush:
                frame.STACK.push(frame.read8());
                break;            
            case Opcodes.ifne:
                var jmp = frame.IP - 1 + Helper.getSInt(frame.read16());                                
                if (frame.STACK.pop() !== 0) {
                    frame.IP = jmp;
                }                
                break;
            case Opcodes.if_icmple:
                var jmp = frame.IP - 1 + Helper.getSInt(frame.read16());                                
                if (frame.STACK.pop() >= frame.STACK.pop()) {
                    frame.IP = jmp;
                }
                break;
            case Opcodes.if_icmplt:
                var jmp = frame.IP - 1 + Helper.getSInt(frame.read16());                                
                if (frame.STACK.pop() > frame.STACK.pop()) {
                    frame.IP = jmp;
                }
                break;            
            case Opcodes.iinc:
                frame.LOCALS[frame.read8()] += frame.read8();
                break;
            case Opcodes.anewarray:
                var type = frame.read16();
                var size = frame.STACK.pop();
                frame.STACK.push(new Array(size));                
                break;
            case Opcodes.dup:
                var ref = frame.STACK.pop();
                frame.STACK.push(ref);
                frame.STACK.push(ref);
                break;
            case Opcodes.pop:
                frame.STACK.pop();
                break;
            case Opcodes.aastore:
                var val = frame.STACK.pop();
                var indx = frame.STACK.pop();                
                var ref = frame.STACK.pop();                
                ref[indx] = val;
                break;
            case Opcodes.goto:                
                frame.IP += Helper.getSInt(frame.read16()) - 1;
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

