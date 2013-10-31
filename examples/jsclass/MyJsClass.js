

var MyJsClass = module.exports = function() {
    if (this instanceof MyJsClass) {
    } else {
        return new MyJsClass();
    }
}

MyJsClass.getClassName = function() {
    return "jvm/examples/jsclass/MyJsClass";
}

MyJsClass.prototype.init = function(nick) {
    this.nick = nick;    
}

MyJsClass.prototype.getName = function() {
    return this.nick;
}

MyJsClass.prototype.say = function(message) {
    console.log("This message from java <" + message + ">");
}

MyJsClass.prototype.bye = function() {
    console.log(this.nick + ": bye!!!");
}

