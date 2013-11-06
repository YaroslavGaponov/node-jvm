/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var fs = require("fs");
var path = require("path");

var globalizer = require("./util/globalizer");

var Classes = require("./classes");
var Threads = require("./threads");

var OPCODES = require("./opcodes");

var tick = function(fn) {
    var async = true;
    
    if (THREADS.length === 1) {
        if (TICKS < 500) {
            async = false;
            TICKS++;
        } else {
            TICKS = 0;
        }
    }
    
    if (async) {
        (setImmediate || process.nextTick)(fn);
    } else {
        fn();
    }
}

var JVM = module.exports = function() {
    if (this instanceof JVM) {
        globalizer.add("CLASSES", new Classes());
        globalizer.add("THREADS", new Threads());
        globalizer.add("OPCODES", OPCODES);
        globalizer.add("TICK", tick);
        globalizer.add("TICKS", 0);
    } else {
        return new JVM();
    }
}

JVM.prototype.loadClassFile = function(fileName) {
    return CLASSES.loadClassFile(fileName);
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

JVM.prototype.loadJSFile = function(fileName) {
    return CLASSES.loadJSFile(fileName);
}

JVM.prototype.run = function() {
    var entryPoint = CLASSES.getEntryPoint();
    if (!entryPoint) {
        throw new Error("Entry point method is not found.");
    }
    
    THREADS.add("main");
    entryPoint.run(arguments, function(code) {
        THREADS.remove("main");
        var exit = function() {
            TICK(function() {
                if (THREADS.length === 0) {
                    process.exit(code);
                } else {
                    exit();
                }
            });
        };
        exit();
    });
}

