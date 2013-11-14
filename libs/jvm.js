/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var fs = require("fs");
var path = require("path");
var EE = require("events").EventEmitter;

var globalizer = require("./util/globalizer");

var Classes = require("./classes");
var Threads = require("./threads");
var Scheduler = require("./scheduler");
var Logger = require("./logger");

var OPCODES = require("./opcodes");
var Thread = require("./thread");

var JVM = module.exports = function() {
    if (this instanceof JVM) {
        JVM.super_.call(this);
        globalizer.add("LOG", new Logger());
        globalizer.add("CLASSES", new Classes());
        globalizer.add("THREADS", new Threads());
        globalizer.add("SCHEDULER", new Scheduler());
        globalizer.add("OPCODES", OPCODES);
        
        THREADS.add(new Thread("main"));
        
        this.entryPoint = {
            className: null,
            methodName: "main"
        };
    } else {
        return new JVM();
    }
}

util.inherits(JVM, EE);

JVM.prototype.setEntryPointClassName = function(className) {
    this.entryPoint.className = className;
}

JVM.prototype.setEntryPointMethodName = function(methodName) {
    this.entryPoint.methodName = methodName;
}

JVM.prototype.setLogLevel = function(level) {
    LOG.setLogLevel(level);
}

JVM.prototype.loadClassFile = function(fileName) {
    return CLASSES.loadClassFile(fileName);
}

JVM.prototype.loadClassFiles = function(dirName) {
    var self = this;
    CLASSES.addPath(dirName);
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

JVM.prototype.loadJSFile = function(fileName) {
    return CLASSES.loadJSFile(fileName);
}

JVM.prototype.loadJarFile = function(fileName) {
    return CLASSES.loadJarFile(fileName);
}

JVM.prototype.run = function() {
    var self = this;
    
    CLASSES.clinit();
    
    var entryPoint = CLASSES.getEntryPoint(this.entryPoint.className, this.entryPoint.methodName);
    if (!entryPoint) {
        throw new Error("Entry point method is not found.");
    }
        
    entryPoint.run(arguments, function(code) {
        var exit = function() {
            SCHEDULER.tick(0, function() {
                if (THREADS.count() === 1) {
                    THREADS.remove(0);
                    self.emit("exit", code);
                } else {
                    exit();
                }
            });
        };
        exit();
    });
}

