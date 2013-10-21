
var util = require("util");
var fs = require("fs");


var ClassArea = require("./classfile/classarea.js");
var Frame = require("./frame.js");
var ACCESS_FLAGS = require("./classfile/accessflags.js");


var JVM = module.exports = function(entryPoint) {
    if (this instanceof JVM) {
        this.classes = {};
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
}


JVM.prototype.getNewFrame = function() {
    var self = this;
    return function(className, method) {    
        var classArea = self.classes[className];
        
        if (!classArea) {
            return null;
        }
        
        var methods = classArea.getMethods();
        var constantPool = classArea.getPoolConstant();
        for(var i=0; i<methods.length; i++) {
            if (constantPool[methods[i].name_index].bytes === method) {
                return new Frame(self.getNewFrame(), classArea, methods[i]);    
            }
        }    
    }
}


JVM.prototype.run = function() {
    var entryPointFrame = null;

    for(var className in this.classes) {
        var classArea = this.classes[className];
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
                        entryPointFrame = new Frame(this.getNewFrame(), classArea, methods[i]);    
                    }
                }
            }
        }
    }
    
    if (!entryPointFrame) {
        throw new Error("Entry point method is not found.");
    }    
    
    process.exit(
        entryPointFrame.run(arguments)
    );
    
}

