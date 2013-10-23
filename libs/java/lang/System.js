var util = require("util");

var System = module.exports = function() {
    if (this instanceof System) {
    } else {
        return new System();
    }
}

System["exit"] = function() {
    process.exit();
}

System["out"] = {
    "print": function() {
        util.print.apply(null, arguments);
    },
    "println": function() {
        util.print.apply(null, arguments);
        util.print("\n");
    },
    "format": function(fmt, args) {
        util.print(util.format.apply(null, [fmt].concat(args)));
    }    
}


