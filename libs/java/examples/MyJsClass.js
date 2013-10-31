

var MyJsClass = module.exports = function() {
    if (this instanceof MyJsClass) {
    } else {
        return new MyJsClass();
    }
}

MyJsClass.prototype.say = function(message) {
    console.log(message);
}

