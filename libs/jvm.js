/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var fs = require("fs");
var path = require("path");

require("./opcodes").globalize();
require("./classes").globalize();
require("./threads").globalize();
require("./tick").globalize();

var JVM = module.exports = function() {
    if (this instanceof JVM) {
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
            TICK (function() {
                if (THREADS.isEmpty()) {
                    process.exit(code);
                } else {
                    exit();
                }
            });
        };
        exit();
    });
}

