var util = require("util");

var out = module.exports = function() {
    if (this instanceof out) {        
    } else {
        return new out();
    }
};

    
out["print"] = function() {
    util.print.apply(null, arguments);
};

out["println"] = function() {
    util.print.apply(null, arguments);
    util.print("\n");
};

out["format"] = function(fmt, args) {
    util.print(util.format.apply(null, [fmt].concat(args)));
}
