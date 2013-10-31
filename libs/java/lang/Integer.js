/*
 node-jvm
 Copyright (c) 2013 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var Integer = module.exports = function() {
    if (this instanceof Integer) {
    } else {
        return new Integer();
    }
}

Integer.getClassName = function() {
    return "java/lang/Integer";
}
 
Integer.parseInt = function() {
    return parseInt.apply(null, arguments);
}

Integer.valueOf = function() {
    if (arguments.length === 0) return "0";
    return arguments[0].toString();
}

