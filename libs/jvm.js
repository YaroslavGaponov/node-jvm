/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

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
    return classArea;
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
        getClass: function(className) {
            var classArea = self.classes[className];
            if (!classArea) {
                var fileNameBase = util.format("%s/%s", __dirname, className);
                if (fs.existsSync(fileNameBase + ".js")) {
                    return require(fileNameBase + ".js");
                } else if(fs.existsSync(fileNameBase + ".class")) {
                    return self.loadClassFile(fileNameBase + ".class");
                } else {
                    throw new Error(util.format("Implementation of the % class is not found.", className));
                }
            } else {
                return classArea;
            }
        },
        getStaticField: function(className, staticField) {
            var clazz = API.getClass(className);
            if (clazz instanceof ClassArea) {
                var fields = clazz.getFields();
                var constantPool = clazz.getPoolConstant();
                for(var i=0; i<fields.length; i++) {
                    if (constantPool[fields[i].name_index].bytes === staticField) {
                        return null
                    }
                }                
            } else {
                return clazz[staticField];
            }
        },
        getStaticMethod: function(className, methodName) {
            var clazz = API.getClass(className);  
            if(clazz instanceof ClassArea) {
                var methods = clazz.getMethods();
                var constantPool = clazz.getPoolConstant();
                for(var i=0; i<methods.length; i++) {
                    if (constantPool[methods[i].name_index].bytes === methodName) {
                        return new Frame(API, clazz, methods[i]);    
                    }
                }                
            } else {
                return clazz[methodName];
            }
        },
        getMethod: function(className, methodName) {
            var clazz = API.getClass(className);
            if (clazz instanceof ClassArea) {
                var methods = clazz.getMethods();
                var constantPool = clazz.getPoolConstant();
                for(var i=0; i<methods.length; i++) {
                    if (constantPool[methods[i].name_index].bytes === methodName) {
                        return new Frame(API, clazz, methods[i]);    
                    }
                }
            } else {
                var o = new clazz();
                return o[methodName];
            }
        },
        createNewObject: function(className) {
            var clazz = API.getClass(className);
            if (clazz instanceof ClassArea) {
                var o = Object.create(API.createNewObject(clazz.getSuperClassName()));
                o._className = className;
                
                clazz.getFields().forEach(function(field) {
                    o[clazz.getPoolConstant()[field.name_index].bytes] = null;
                });
                
                clazz.getMethods().forEach(function(method) {
                    var methodName = clazz.getPoolConstant()[method.name_index].bytes;
                    o[methodName] = new Frame(API, clazz, method);
                });
                
                return o;
            } else {
                return new clazz();
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
        util.debug("Not support opcodes: " + notSupportOpcode.toString());
    }
    
    
    process.JVM = {
        threads: 0
    };
    
    entryPointFrame.run(arguments, function(code) {
        var halt = function() {
            setImmediate(function() {
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

