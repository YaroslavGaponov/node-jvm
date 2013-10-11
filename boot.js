
var util = require("util");
var fs = require("fs");
var StreamReader = require("./reader.js");
var Opcodes = require("./opcodes.js");


var getClassImage = function(classBytes) {

    var classImage = {};
    
    var TAGS = {
        CONSTANT_Class: 7,
        CONSTANT_Fieldref: 9,
        CONSTANT_Methodref: 10,
        CONSTANT_InterfaceMethodref: 11,
        CONSTANT_String: 8,
        CONSTANT_Integer: 3,
        CONSTANT_Float: 4,
        CONSTANT_Long: 5,
        CONSTANT_Double: 6,
        CONSTANT_NameAndType: 12,
        CONSTANT_Utf8: 1,
        CONSTANT_Unicode: 2,
        toString: function(tag) {
            for(var name in this) {
                if (this[name] === tag) {
                    return name;
                }
            }
            return null;
        }
        
    };
    
    var ACCESS_FLAGS = {
        ACC_PUBLIC: 0x0001,
        ACC_PRIVATE: 0x0002,
        ACC_PROTECTED: 0x0004,
        ACC_STATIC: 0x0008,
        ACC_FINAL: 0x0010,
        ACC_SYNCHRONIZED: 0x0020,
        ACC_VOLATILE: 0x0040,
        ACC_TRANSIENT: 0x0080,
        ACC_NATIVE: 0x0100,
        ACC_INTERFACE: 0x0200,
        ACC_ABSTRACT: 0x0400,
        toString: function(flags) {
            var flagNames = [];
            for(var flag in this) {
                if ((this[flag] & flags) !== 0) {
                    flagNames.push(flag);
                }
            }
            return flagNames.toString();
        }
    };
    
    var ATTRIBUTE_TYPES = {
        ConstantValue:  "ConstantValue",
        Code: "Code",
        Exceptions: "Exceptions",
        InnerClasses: "InnerClasses",
        Synthetic: "Synthetic",
        SourceFile: "SourceFile",
        LineNumberTable: "LineNumberTable",
        LocalVariableTable: "LocalVariableTable",
        Deprecated: "Deprecated"
    };
    
    var getAttribues = function(attribute_name_index, bytes) {
            
        var sr = new StreamReader.create(bytes);
        var res = { attribute_name_index: attribute_name_index };
    
    
        var item = classImage.constant_pool[attribute_name_index];
    
        
        switch(item.tag) {
        
            case TAGS.CONSTANT_Long:
            case TAGS.CONSTANT_Float:
            case TAGS.CONSTANT_Double:
            case TAGS.CONSTANT_Integer:
            case TAGS.CONSTANT_String:
                res.type = ATTRIBUTE_TYPES.ConstantValue;
                res.constantvalue_index = sr.readWord();
                return res;        
            
                
            case TAGS.CONSTANT_Utf8:
                
                switch(item.bytes) {
                    
                    case "Code":
                        res.type = ATTRIBUTE_TYPES.Code;
                        res.max_stack = sr.readWord();
                        res.max_locals = sr.readWord();
                        var code_length = sr.readDWord();
                        res.code = sr.readBytes(code_length);
                        
                        var exception_table_length = sr.readWord();        
                        res.exception_table = [];
                        for(var i=0; i<exception_table_length; i++) {
                            var start_pc = sr.readWord();
                            var end_pc = sr.readWord();
                            var handler_pc= sr.readWord();
                            var catch_type = sr.readWord();
                            res.exception_table.push({start_pc:start_pc,end_pc:end_pc,handler_pc:handler_pc,catch_type:catch_type });
                        }
                        
                        var attributes_count = sr.readWord();        
                        res.attributes = [];
                        for(var i=0; i<attributes_count; i++) {
                            var attribute_name_index = sr.readWord();
                            var attribute_length = sr.readWord();
                            var info = sr.readBytes(attribute_length);
                            res.attributes.push({ attribute_name_index: attribute_name_index, attribute_length: attribute_length, info: info });
                        }
                        return res;
                        
                    case "SourceFile":
                        res.type = ATTRIBUTE_TYPES.SourceFile;
                        res.sourcefile_index = sr.readWord();
                        return res;
                    
                    case "Exceptions":
                        res.type = ATTRIBUTE_TYPES.Exceptions;
                        var number_of_exceptions = sr.readWord();
                        res.exception_index_table = [];
                        for(var i=0; i<number_of_exceptions; i++) {
                            res.exception_index_table.push(sr.readWord());
                        }
                        return res;
                    
                    default:
                        throw new Error("This attribute type is not supported yet. [" + JSON.stringify(item) + "]");            
                }
                
            default:
                throw new Error("This attribute type is not supported yet. [" + JSON.stringify(item) + "]");            
        }
    };
    
    
    var sr = StreamReader.create(classBytes);
    classImage.magic = sr.readDWord().toString(16);

    classImage.version = {
        minor_version: sr.readWord(),
        major_version: sr.readWord()
    };
        
    classImage.constant_pool = [ null ];
    var constant_pool_count = sr.readWord();
    for(var i=1; i<constant_pool_count; i++) {        
        var tag =  sr.readByte();
        switch(tag) {
            case TAGS.CONSTANT_Class:
                var name_index = sr.readWord();
                classImage.constant_pool.push( { tag: tag, name_index: name_index } );
                break;
            case TAGS.CONSTANT_Utf8:
                var length = sr.readWord();
                var bytes = sr.readString(length);
                classImage.constant_pool.push( { tag: tag, length: length, bytes: bytes } );
                break;
            case TAGS.CONSTANT_Methodref:
                var class_index = sr.readWord();
                var name_and_type_index = sr.readWord();
                classImage.constant_pool.push( {  tag: tag, class_index: class_index, name_and_type_index: name_and_type_index } );
                break;
            case TAGS.CONSTANT_NameAndType:
                var name_index = sr.readWord();
                var signature_index = sr.readWord();
                classImage.constant_pool.push( { tag: tag, name_index: name_index,  signature_index: signature_index } );                
                break;
            case TAGS.CONSTANT_Fieldref:
                var class_index = sr.readWord();
                var name_and_type_index = sr.readWord();
                classImage.constant_pool.push( { tag: tag, class_index: class_index,  name_and_type_index: name_and_type_index } );                                
                break;
            case TAGS.CONSTANT_String:
                var string_index = sr.readWord();
                classImage.constant_pool.push( { tag: tag, string_index: string_index } );                                                
                break;
            case TAGS.CONSTANT_Integer:
                var bytes = sr.readDWord();
                classImage.constant_pool.push( {  tag: tag, bytes: bytes} );                                                
                break;                
            default:                
                throw new Error(util.format("tag %s is not supported.", tag));
        }
    }
        
    classImage.access_flags = sr.readWord();
    
    classImage.this_class = sr.readWord();
    
    classImage.super_class = sr.readWord();

    
    classImage.interfaces = [];
    var interfaces_count = sr.readWord();
    for(var i=0; i<interfaces_count; i++) {
        var index = sr.readWord();
        if (index != 0){
            classImage.interfaces.push(index);
        }
    }
        
    classImage.fields = [];
    var fields_count = sr.readWord();
    for(var i=0; i<fields_count; i++) {
        var access_flags = sr.readWord();
        var name_index = sr.readWord();
        var descriptor_index = sr.readWord();
        var attributes_count = sr.readWord();
        var field_info = {
            access_flags: access_flags,
            name_index: name_index,
            descriptor_index: descriptor_index,
            attributes_count: attributes_count,
            attributes: []
        }
        for(var j=0; j <attributes_count; j++) {
            var attribute_name_index = sr.readWord();
            var attribute_length = sr.readDWord();
            var constantvalue_index = sr.readWord();            
            var attribute = {
                attribute_name_index: attribute_name_index,
                attribute_length: attribute_length,
                constantvalue_index: constantvalue_index
            }            
            field_info.attributes.push(attribute);
        }
        classImage.fields.push(field_info);
    }    
    
    
    classImage.methods = [];
    var methods_count = sr.readWord();
    for(var i=0; i<methods_count; i++) {
        var access_flags = sr.readWord();
        var name_index = sr.readWord();
        var signature_index = sr.readWord();
        var attributes_count = sr.readWord();
        var method_info  = {
            access_flags: access_flags,
            name_index: name_index,
            signature_index: signature_index,
            attributes_count: attributes_count,
            attributes: []
        }        
        for(var j=0; j <attributes_count; j++) {
            var attribute_name_index = sr.readWord();
            var attribute_length = sr.readDWord();
            var info = getAttribues(attribute_name_index, sr.readBytes(attribute_length));            
            var attribute = {
                attribute_name_index: attribute_name_index,
                attribute_length: attribute_length,
                info: info
            }
            method_info.attributes.push(attribute);
        }
                
        classImage.methods.push(method_info);
    }
    
    
    classImage.attributes = [];
    var attributes_count = sr.readWord();
    for(var i=0; i<attributes_count; i++) {
            var attribute_name_index = sr.readWord();
            var attribute_length = sr.readDWord();
            var info = getAttribues(attribute_name_index, sr.readBytes(attribute_length));            
            var attribute = {
                attribute_name_index: attribute_name_index,
                attribute_length: attribute_length,
                info: info
            }
            classImage.attributes.push(attribute);        
    }
    
    return classImage;
 
}


fs.readFile(process.argv[2], function(error, bytes) {
    if (!error) {
        fs.writeFileSync(process.argv[2] + ".json", JSON.stringify(getClassImage(bytes)));
    }
});
