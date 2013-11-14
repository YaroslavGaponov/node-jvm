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

var Classes = module.exports = function() {
    if (this instanceof Classes) {
        this.paths = [ __dirname ];
        this.classes = {};
        this.staticFields = {};
    } else  {
        return new Classes();
    }
}

Classes.prototype.addPath = function(path) {
    if (this.paths.indexOf(path) === -1) {
        this.paths.push(path);
    }
}

Classes.prototype.clinit = function() {
    for(var className in this.classes) {
        classArea = this.classes[className];
        var clinit = this.getStaticMethod(className, "<clinit>", "()V");
        if (clinit instanceof Frame) {
            SCHEDULER.sync(function() {
                LOG.debug("call " + className + ".<clinit> ...");
                clinit.run([], function() {
                    LOG.debug("call " + className + ".<clinit> ... done");
                });
            });
        }
    }
}

Classes.prototype.loadClassBytes = function(bytes) {
    var classArea = new ClassArea(bytes);
    this.classes[classArea.getClassName()] = classArea;
    var classes = classArea.getClasses();
    for (var i=0; i<classes.length; i++) {
        if (!this.classes[classes[i]]) {
            this.loadClassFile(path.dirname(fileName) + path.sep + classes[i] + ".class");
        }
    }
    return classArea;
}

Classes.prototype.loadClassFile = function(fileName) {
    LOG.debug("loading " + fileName + " ...");
    var bytes = fs.readFileSync(fileName);
    return this.loadClassBytes(bytes);
}

Classes.prototype.loadJSFile = function(fileName) {
    LOG.debug("loading " + fileName + " ...");
    var classArea = require(fileName);
    this.classes[classArea.getClassName()] = classArea;
    return classArea;
}

Classes.prototype.loadJarFile = function(fileName) {
    var self = this;
    
    var AdmZip = require("adm-zip");

    var zip = new AdmZip(fileName);
    var zipEntries = zip.getEntries();

    var mainClass;
    
    zipEntries.forEach(function(zipEntry) {
        if (!zipEntry.isDirectory) {
            if (path.extname(zipEntry.entryName) === ".class") {
                LOG.debug("loading " + fileName + '@' + zipEntry.entryName + " ...");
                self.loadClassBytes(zipEntry.getData());
            } else if (zipEntry.entryName === "META-INF/MANIFEST.MF") {
                var manifest = zipEntry.getData().toString().split('\n');
                for(var i=0; i<manifest.length; i++) {
                    var line = [];
                    manifest[i].split(':').forEach(
                        function(p) {
                            line.push(p.trim());
                        }
                    );
                    if (line[0] === "Main-Class") {
                        mainClass = line[1];
                        break;
                    }
                }                
            }
        }
        return mainClass;
    });    
}

Classes.prototype.getEntryPoint = function(className, methodName) {
    for(var name in this.classes) {
        var ca = this.classes[name];
        if (ca instanceof ClassArea) {
            if (!className || (className === ca.getClassName())) {
                if (ACCESS_FLAGS.isPublic(ca.getAccessFlags())) {
                    var methods = ca.getMethods();
                    var cp = ca.getConstantPool();
                    for(var i=0; i<methods.length; i++) {
                        if
                        (
                         ACCESS_FLAGS.isPublic(methods[i].access_flags) &&
                         ACCESS_FLAGS.isStatic(methods[i].access_flags) &&
                         cp[methods[i].name_index].bytes === methodName
                        )
                        { return new Frame(ca, methods[i]); }
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
    for(var i=0; i<this.paths.length; i++) {
        var fileName = util.format("%s/%s", this.paths[i], className);
        if (fs.existsSync(fileName + ".js")) {
            return this.loadJSFile(fileName + ".js");
        }
        if(fs.existsSync(fileName + ".class")) {
            return this.loadClassFile(fileName + ".class");
        }
    }
    throw new Error(util.format("Implementation of the %s class is not found.", className));
};

Classes.prototype.getStaticField = function(className, fieldName) {
    return this.staticFields[className + '.' + fieldName]; 
}

Classes.prototype.setStaticField = function(className, fieldName, value) {
    this.staticFields[className + '.' + fieldName] = value;
}

Classes.prototype.getStaticMethod = function(className, methodName, signature) {
    var ca = this.getClass(className);  
    if (ca instanceof ClassArea) {
        var methods = ca.getMethods();
        var cp = ca.getConstantPool();
        for(var i=0; i<methods.length; i++) 
            if (ACCESS_FLAGS.isStatic(methods[i].access_flags)) 
                if (cp[methods[i].name_index].bytes === methodName)
                    if (signature.toString() === cp[methods[i].signature_index].bytes)
                        return new Frame(ca, methods[i]);
    } else {
        if (methodName in ca) {
            return ca[methodName];
        }
    }
    return null;
};
        
Classes.prototype.getMethod = function(className, methodName, signature) {
    var ca = this.getClass(className);
    if (ca instanceof ClassArea) {
        var methods = ca.getMethods();
        var cp = ca.getConstantPool();
        for(var i=0; i<methods.length; i++)
            if (!ACCESS_FLAGS.isStatic(methods[i].access_flags)) 
                if (cp[methods[i].name_index].bytes === methodName) 
                    if (signature.toString() === cp[methods[i].signature_index].bytes) 
                        return new Frame(ca, methods[i]);
    } else {
        var o = new ca();
        if (methodName in o) {
           return o[methodName];
        }
    }
    return null;
};
        
Classes.prototype.newObject = function(className) {
    var ca = this.getClass(className);
    if (ca instanceof ClassArea) {
        
        var ctor = function() {};
        ctor.prototype = this.newObject(ca.getSuperClassName());
        var o = new ctor();
        
        o.getClassName = new Function(util.format("return \"%s\"", className));
        
        var cp = ca.getConstantPool();
        
        ca.getFields().forEach(function(field) {
            var fieldName = cp[field.name_index].bytes;
            o[fieldName] = null;
        });
        
        ca.getMethods().forEach(function(method) {
            var methodName = cp[method.name_index].bytes;
            o[methodName] = new Frame(ca, method);
        });
        
        return o;
    } else {
        var o = new ca();
        o.getClassName = new Function(util.format("return \"%s\"", className));
        return o;
    }
}

Classes.prototype.newException = function(className, message, cause) {
    var ex = this.newObject(className);
    ex["<init>"](message, cause);
    return ex;
}

