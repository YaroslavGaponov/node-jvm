
var util = require("util");
var fs = require("fs");
var path = require("path");


var ClassArea = require("./classfile/classarea.js");
var Frame = require("./frame.js");
var ACCESS_FLAGS = require("./classfile/accessflags.js");
var Opcodes = require("./opcodes.js");


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
    util.debug("JVM: loading " + classFileName + " ...");
    var bytes = fs.readFileSync(classFileName);
    var classArea = new ClassArea(bytes);
    this.classes[classArea.getClassName()] = classArea;        
}

JVM.prototype.loadClassFiles = function(dirName) {
    var self = this;
    var files = fs.readdirSync(dirName);
    files.forEach(function(file) {
        var p = util.format("%s/%s", dirName, file);
        var stat = fs.statSync(p);
        if (stat.isFile()) {
            if (path.extname(file) === ".class") {
                self.loadClassFile(p);
            }
        } else if (stat.isDirectory()) {
            self.loadClassFiles(p);
        }
    });
}


JVM.prototype.api = function() {
    var self = this;
    
    var API = {
        getStaticField: function(className, staticField) {
            var classArea = self.classes[className];
            if (!classArea) {
                var ctor = require(util.format("%s/%s.js", __dirname, className));
                return ctor[staticField];
            } else {
                var fields = classArea.getFields();
                var constantPool = classArea.getPoolConstant();
                for(var i=0; i<fields.length; i++) {
                    if (constantPool[fields[i].name_index].bytes === staticField) {
                        return null
                    }
                }
            }
            throw new Error(util.format("static class %s.%s is not found", className, staticField));
        },
        getStaticMethod: function(className, method) {    
            var classArea = self.classes[className];
            
            if (!classArea) {
                var ctor = require(util.format("%s/%s.js", __dirname, className));
                return ctor[method];
            } else {            
                var methods = classArea.getMethods();
                var constantPool = classArea.getPoolConstant();
                for(var i=0; i<methods.length; i++) {
                    if (constantPool[methods[i].name_index].bytes === method) {
                        return new Frame(API, classArea, methods[i]);    
                    }
                }
            }
        },
        getMethod: function(className, methodName) {            
            var classArea = self.classes[className];
            
            if (!classArea) {
                var ctor = require(util.format("%s/%s.js", __dirname, className));
                var o = new ctor(); 
                return o[methodName];
            } else {            
                var methods = classArea.getMethods();
                var constantPool = classArea.getPoolConstant();
                for(var i=0; i<methods.length; i++) {
                    if (constantPool[methods[i].name_index].bytes === methodName) {
                        return new Frame(API, classArea, methods[i]);    
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
                var o = Object.create(API.createNewObject(classArea.getSuperClassName()));
                o.__className = className;
                
                classArea.getFields().forEach(function(field) {
                    o[classArea.getPoolConstant()[field.name_index].bytes] = null;
                });
                
                classArea.getMethods().forEach(function(method) {
                    var methodName = classArea.getPoolConstant()[method.name_index].bytes;
                    o[methodName] = new Frame(API, classArea, method);
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
    
    var notSupportOpcode = [];
    for (var opcode in Opcodes) {
        if (!entryPointFrame[opcode]) {
            if (["return", "ireturn", "lreturn", "dreturn", "freturn", "areturn"].indexOf(opcode) === -1) {
                notSupportOpcode.push(opcode);
            }
        }
    }
    if (notSupportOpcode.length > 0) {
        util.debug("Not support opcodes: " + notSupportOpcode.join(","));
    }
    
    
    process.JVM = {
        threads: 0
    };
    
    entryPointFrame.run(arguments, function(code) {
        var halt = function() {
            process.nextTick(function() {
                if (process.JVM.threads === 0) {
                    process.exit(code);
                } else {
                    halt();
                }
            });
        };
        halt();
    });
    
}

