/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var fs = require("fs");

var ClassArea = require("./classfile/classarea.js");
var Frame = require("./frame.js");

var ACCESS_FLAGS = require("./classfile/accessflags.js");

var Classes = module.exports = function() {
    if (this instanceof Classes) {
        this.classes = {};
    } else  {
        return new Classes();
    }
}

Classes.prototype.loadClassFile = function(fileName) {
    LOG.debug("loading " + fileName + " ...");
    var bytes = fs.readFileSync(fileName);
    var classArea = new ClassArea(bytes);
    this.classes[classArea.getClassName()] = classArea;
    return classArea;
}

Classes.prototype.loadJSFile = function(fileName) {
    LOG.debug("loading " + fileName + " ...");
    var classArea = require(fileName);
    this.classes[classArea.getClassName()] = classArea;
    return classArea;
}

Classes.prototype.getEntryPoint = function(className, methodName) {
    methodName = methodName || "main";
    for(var name in this.classes) {
        var ca = this.classes[name];
        if (ca instanceof ClassArea) {
            if (!className || (className === ca.getClassName())) {    
                if (ACCESS_FLAGS.isPublic(ca.getAccessFlags())) {
                    var ms = ca.getMethods();
                    var cp = ca.getConstantPool();
                    for(var i=0; i<ms.length; i++) {
                        if
                        (
                         ACCESS_FLAGS.isPublic(ms[i].access_flags) &&
                         ACCESS_FLAGS.isStatic(ms[i].access_flags) &&
                         cp[ms[i].name_index].bytes === methodName
                        )
                        { return new Frame(ca, ms[i]); }
                    }
                }
            }
        }
    }    
}

Classes.prototype.getClass = function(className) {
    var ca = this.classes[className];
    if (ca) {
        return ca;
    }
    var fileName = util.format("%s/%s", __dirname, className);
    if (fs.existsSync(fileName + ".js")) {
        return this.loadJSFile(fileName + ".js");
    }
    if(fs.existsSync(fileName + ".class")) {
        return this.loadClassFile(fileName + ".class");
    }
    throw new Error(util.format("Implementation of the %s class is not found.", className));
};
        
        
Classes.prototype.getStaticField = function(className, fieldName, classNameStatic) {
    var ca = this.getClass(className);
    if (ca instanceof ClassArea) {
        var fields = ca.getFields();
        var cp = ca.getConstantPool();
        for(var i=0; i<fields.length; i++) {
            if (cp[fields[i].name_index].bytes === fieldName) {
                return this.getClass(classNameStatic);
            }
        }
    } else {
        if (fieldName in ca) {
           return ca[fieldName];
        }
    }
    throw new Error(util.format("Static field %s.%s is not found.", className, fieldName));
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
    } else {
        if (methodName in clazz) {
            return clazz[methodName];
        }
    }
    throw new Error(util.format("Static method %s.%s is not found.", className, methodName));
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
    } else {
        var o = new clazz();
        if (methodName in o) {
           return o[methodName];
        }
    }
    throw new Error(util.format("Method %s.%s is not found.", className, methodName));
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

