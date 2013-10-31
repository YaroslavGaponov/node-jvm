/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var util = require("util");

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
    util.print.apply(null, arguments);
};

out.prototype["println"] = function() {
    util.print.apply(null, arguments);
    util.print("\n");
};

out.prototype["format"] = function(fmt, args) {
    util.print(util.format.apply(null, [fmt].concat(args)));
}
