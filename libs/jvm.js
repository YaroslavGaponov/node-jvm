
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


JVM.prototype.api = function() {
    var self = this;
    
    var API = {
        getMethod: function(className, method) {    
            var classArea = self.classes[className];
            
            if (!classArea) {
                var ctor = require(util.format("%s/%s.js", __dirname, className));
                return method === "<init>" ? ctor : ctor[method];
            } else {            
                var methods = classArea.getMethods();
                var constantPool = classArea.getPoolConstant();
                for(var i=0; i<methods.length; i++) {
                    if (constantPool[methods[i].name_index].bytes === method) {
                        return new Frame(self.api(), classArea, methods[i]);    
                    }
                }
            }
        },
        createNewObject: function(className) {
            var classArea = self.classes[className];
            
            if (!classArea) {
                var ctor = require(util.format("%s/%s.js", __dirname, className));
                return new ctor();
            } else {
                var o = {};
                
                classArea.getFields().forEach(function(field) {
                    o[classArea.getPoolConstant()[field.name_index].bytes] = null;
                });
                
                classArea.getMethods().forEach(function(method) {
                    var methodName = classArea.getPoolConstant()[method.name_index].bytes;
                    o[methodName] = new Frame(self.api(), classArea, method);
                });
                
                return o;
            }            
        }
    };
    
    return API;
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
                        entryPointFrame = new Frame(this.api(), classArea, methods[i]);    
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

