
var Clazz = module.exports = function(className, clazz) {
    if (this instanceof Clazz) {
        this._className = className; 
        this._clazz = clazz;
    } else {
        return new Clazz(className, clazz);
    }
}

Clazz.getClassName = function() {
    return "java/lang/Class";
}
 
Clazz.forName = function(className) {
    return new Clazz(className, CLASSES.getClass(className));
}

Clazz.prototype.newInstance = function() {
    return CLASSES.newObject(this._className);

}