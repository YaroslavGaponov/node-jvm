/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var fs = require("fs");

var ClassArea = require("./classfile/classarea.js");
var Frame = require("./frame.js");
var ACCESS_FLAGS = require("./classfile/accessflags.js");

var Loader = module.exports = function() {
    if (this instanceof Loader) {
        this.classes = {};
    } else  {
        return new Loader();
    }
}

Loader.prototype.loadClassFile = function(fileName) {
    util.debug("JVM: loading " + fileName + " ...");
    var bytes = fs.readFileSync(fileName);
    var classArea = new ClassArea(bytes);
    this.classes[classArea.getClassName()] = classArea;
    return classArea;
}

Loader.prototype.loadJSFile = function(fileName) {
    util.debug("JVM: loading " + fileName + " ...");
    var classArea = require(fileName);
    this.classes[classArea.getClassName()] = classArea;
    return classArea;
}

Loader.prototype.getEntryPointFrame = function(className, methodName) {
    if (!methodName) {
        methodName = "main";
    }
    for(var name in this.classes) {
        var classArea = this.classes[name];
        if (!className || (className === classArea.getClassName())) {    
            if ((classArea.getAccessFlags() & ACCESS_FLAGS.ACC_PUBLIC) !== 0) {
                var methods = classArea.getMethods();
                var constantPool = classArea.getPoolConstant();
                for(var i=0; i<methods.length; i++) {
                    if
                    (
                        ((methods[i].access_flags & ACCESS_FLAGS.ACC_PUBLIC) !== 0) &&
                        ((methods[i].access_flags & ACCESS_FLAGS.ACC_STATIC) !== 0) &&
                        (constantPool[methods[i].name_index].bytes === methodName)
                    )
                    {
                        return entryPointFrame = new Frame(classArea, methods[i]);    
                    }
                }
            }
        }
    }    
}

Loader.prototype.getClass = function(className) {
    var classArea = this.classes[className];
    if (!classArea) {
        var fileNameBase = util.format("%s/%s", __dirname, className);
        if (fs.existsSync(fileNameBase + ".js")) {
            return this.loadJSFile(fileNameBase + ".js");
        } else if(fs.existsSync(fileNameBase + ".class")) {
            return this.loadClassFile(fileNameBase + ".class");
        } else {
            var classNotFoundException = this.createNewObject("java/lang/ClassNotFoundException");
            classNotFoundException["<init>"](util.format("Implementation of the %s class is not found.", className));
            throw classNotFoundException;
        }
    } else {
        return classArea;
    }
};
        
        
Loader.prototype.getStaticField = function(className, staticField) {
    var clazz = this.getClass(className);
    if (clazz instanceof ClassArea) {
        var fields = clazz.getFields();
        var constantPool = clazz.getPoolConstant();
        for(var i=0; i<fields.length; i++) {
            if (constantPool[fields[i].name_index].bytes === staticField) {
                return null
            }
        }
        throw new Error(util.format("Static field %s.%s is not found.", className, staticField));
    } else {
        return clazz[staticField];
    }
};
        
        
Loader.prototype.getStaticMethod = function(className, methodName, signature) {
    var clazz = this.getClass(className);  
    if(clazz instanceof ClassArea) {
        var methods = clazz.getMethods();
        var constantPool = clazz.getPoolConstant();
        for(var i=0; i<methods.length; i++) {
            if (constantPool[methods[i].name_index].bytes === methodName) {
                if (signature.toString() === constantPool[methods[i].signature_index].bytes) {
                    return new Frame(clazz, methods[i]);
                }
            }
        }
        throw new Error(util.format("Static method %s.%s is not found.", className, methodName));
    } else {
        return clazz[methodName];
    }
};
        
Loader.prototype.getMethod = function(className, methodName, signature) {
    var clazz = this.getClass(className);
    if (clazz instanceof ClassArea) {
        var methods = clazz.getMethods();
        var constantPool = clazz.getPoolConstant();
        for(var i=0; i<methods.length; i++) {
            if (constantPool[methods[i].name_index].bytes === methodName) {
                if (signature.toString() === constantPool[methods[i].signature_index].bytes) {
                    return new Frame(clazz, methods[i]);
                }
            }
        }
        throw new Error(util.format("Method %s.%s is not found.", className, methodName));
    } else {
        var o = new clazz();
        return o[methodName];
    }
};
        
Loader.prototype.createNewObject = function(className) {
    var clazz = this.getClass(className);
    if (clazz instanceof ClassArea) {
        
        var ctor = function() {};
        ctor.getClassName = new Function(util.format("return \"%s\"", className));
        ctor.__proto__ = this.createNewObject(clazz.getSuperClassName());
        var o = new ctor();
        
        clazz.getFields().forEach(function(field) {
            o[clazz.getPoolConstant()[field.name_index].bytes] = null;
        });
        
        clazz.getMethods().forEach(function(method) {
            var methodName = clazz.getPoolConstant()[method.name_index].bytes;
            o[methodName] = new Frame(clazz, method);
        });
        
        return o;
    } else {
        return new clazz();
    }
}



