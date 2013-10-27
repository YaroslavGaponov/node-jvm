var util = require("util");
var Object = require("./Object.js");
var Frame = require("./../../frame.js");

var Thread = module.exports = function() {
    if (this instanceof Thread) {
    } else {
        return new Thread();
    }
}

util.inherits(String, Object);

Thread.prototype["<init>"] = function(instance) {
    this.instance = instance;
    //var cp = require('child_process');
    //this.thread = cp.fork(__filename);
    return this;
}


Thread.prototype["start"] = function() {
    //this.thread.send(this.instance);
    process.emit("message", this.instance);
}


process.on('message', function(instance) {
    if (instance["run"] instanceof Frame) {
        instance["run"].run.apply(instance["run"], [instance]);
    } else {
        instance["run"].apply(instance);
    }
});

