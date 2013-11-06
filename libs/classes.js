/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var fs = require("fs");

var ClassArea = require("./classfile/classarea.js");
var Frame = require("./frame.js");

var ACCESS_FLAGS = require("./classfile/accessflags.js");

var Classes = function() {
    if (this instanceof Classes) {
        this.classes = {};
    } else  {
        return new Classes();
    }
}

Classes.prototype.loadClassFile = function(fileName) {
    util.debug("JVM: loading " + fileName + " ...");
    var bytes = fs.readFileSync(fileName);
    var classArea = new ClassArea(bytes);
    this.classes[classArea.getClassName()] = classArea;
    return classArea;
}

Classes.prototype.loadJSFile = function(fileName) {
    util.debug("JVM: loading " + fileName + " ...");
    var classArea = require(fileName);
    this.classes[classArea.getClassName()] = classArea;
    return classArea;
}

Classes.prototype.getEntryPoint = function(className, methodName) {
    methodName = methodName || "main";
    for(var name in this.classes) {
        var classArea = this.classes[name];
        if (classArea instanceof ClassArea) {
            if (!className || (className === classArea.getClassName())) {    
                if (ACCESS_FLAGS.isPublic(classArea.getAccessFlags())) {
                    var ms = classArea.getMethods();
                    var cp = classArea.getConstantPool();
                    for(var i=0; i<ms.length; i++) {
                        if
                        (
                         ACCESS_FLAGS.isPublic(ms[i].access_flags) &&
                         ACCESS_FLAGS.isStatic(ms[i].access_flags) &&
                         cp[ms[i].name_index].bytes === methodName
                        )
                        { return new Frame(classArea, ms[i]); }
                    }
                }
            }
        }
    }    
}

Classes.prototype.getClass = function(className) {
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
        
        
Classes.prototype.getStaticField = function(className, fieldName) {
    var clazz = this.getClass(className);
    if (clazz instanceof ClassArea) {
        var fields = clazz.getFields();
        var cp = clazz.getConstantPool();
        for(var i=0; i<fields.length; i++) {
            if (cp[fields[i].name_index].bytes === fieldName) {
                return;
            }
        }
        throw new Error(util.format("Static field %s.%s is not found.", className, fieldName));
    } else {
        return clazz[fieldName];
    }
};
        
        
Classes.prototype.getStaticMethod = function(className, methodName, signature) {
    var clazz = this.getClass(className);  
    if(clazz instanceof ClassArea) {
        var methods = clazz.getMethods();
        var cp = clazz.getConstantPool();
        for(var i=0; i<methods.length; i++) {
            if (cp[methods[i].name_index].bytes === methodName) {
                if (signature.toString() === cp[methods[i].signature_index].bytes) {
                    return new Frame(clazz, methods[i]);
                }
            }
        }
        throw new Error(util.format("Static method %s.%s is not found.", className, methodName));
    } else {
        return clazz[methodName];
    }
};
        
Classes.prototype.getMethod = function(className, methodName, signature) {
    var clazz = this.getClass(className);
    if (clazz instanceof ClassArea) {
        var methods = clazz.getMethods();
        var cp = clazz.getConstantPool();
        for(var i=0; i<methods.length; i++) {
            if (cp[methods[i].name_index].bytes === methodName) {
                if (signature.toString() === cp[methods[i].signature_index].bytes) {
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
        
Classes.prototype.createNewObject = function(className) {
    var clazz = this.getClass(className);
    if (clazz instanceof ClassArea) {
        
        var ctor = function() {};
        ctor.getClassName = new Function(util.format("return \"%s\"", className));
        var o = new ctor();
        o.prototype = this.createNewObject(clazz.getSuperClassName());
        
        var cp = clazz.getConstantPool();
        
        clazz.getFields().forEach(function(field) {
            var fieldName = cp[field.name_index].bytes;
            o[fieldName] = null;
        });
        
        clazz.getMethods().forEach(function(method) {
            var methodName = cp[method.name_index].bytes;
            o[methodName] = new Frame(clazz, method);
        });
        
        return o;
    } else {
        return new clazz();
    }
}

module.exports.initialize = function() {
    if (!global.CLASSES) {
        global.CLASSES = new Classes();
    }
    return global.CLASSES;
}



