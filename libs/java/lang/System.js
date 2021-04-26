/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var io = require("../../util/io");

var System = module.exports = function() {
    if (this instanceof System) {
    } else {
        return new System();
    }
}

System.getClassName = function() {
    return "java/lang/System";
}
 

System["exit"] = function() {
    process.exit();
}

System["out"] = {
    "print": function() {
        io.print.apply(null, arguments);
    },
    "println": function() {
        io.print.apply(null, arguments);
        io.print("\n");
    },
    "format": function(fmt, args) {
        io.print(util.format.apply(null, [fmt].concat(args)));
    }
}

System["currentTimeMillis"] = function() {
    return new Date().getTime();
}    




