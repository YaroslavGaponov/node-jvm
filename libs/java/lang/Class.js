
var Clazz = module.exports = function(className, clazz) {
    if (this instanceof Clazz) {
        this._className = className; 
        this._clazz = clazz;
    } else {
        return new Clazz(className, clazz);
    }
}

Clazz["forName"] = function(className) {
    return new Clazz(className, process.API.getClass(className));
}

Clazz.prototype.newInstance = function() {
    return process.API.createNewObject(this._className);

}