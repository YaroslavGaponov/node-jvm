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



