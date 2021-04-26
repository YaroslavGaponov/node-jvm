/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");
var io = require("../../util/io");

var out = module.exports = function() {
    if (this instanceof out) {        
    } else {
        return new out();
    }
};

out.getClassName = function() {
    return "java/io/PrintStream";
}
 
out.prototype["print"] = function() {
    io.print.apply(null, arguments);
};

out.prototype["println"] = function() {
    io.print.apply(null, arguments);
    io.print("\n");
};

out.prototype["format"] = function(fmt, args) {
    io.print(util.format.apply(null, [fmt].concat(args)));
}
