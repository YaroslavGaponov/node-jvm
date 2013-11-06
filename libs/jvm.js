/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var fs = require("fs");
var path = require("path");

var Classes = require("./classes");
var Threads = require("./threads");
var tick = require("./util/tick");

var JVM = module.exports = function() {
    if (this instanceof JVM) {
    } else {
        return new JVM();
    }
}

JVM.prototype.loadClassFile = function(fileName) {
    return Classes.getInstance().loadClassFile(fileName);
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
    return Classes.getInstance().loadJSFile(fileName);
}


JVM.prototype.run = function() {
    var entryPoint = Classes.getInstance().getEntryPoint();
    
    if (!entryPoint) {
        throw new Error("Entry point method is not found.");
    }
    
    Threads.getInstance().add("main");

    entryPoint.run(arguments, function(code) {
        Threads.getInstance().remove("main");
        var halt = function() {
            tick(function() {
                if (Threads.getInstance().isEmptyWaitList()) {
                    process.exit(code);
                } else {
                    halt();
                }
            });
        };
        halt();
    });
}

