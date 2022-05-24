

var errors = require("./errors");
// Lib
var Validator = require('jsonschema').Validator;

Validator.prototype.customFormats.mydate = function(input) {
    return Date.parse(input);
};

var v = new Validator();

// Deps
var emailSchema = {
    id : '/email', type : 'string' , pattern : /[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,}/i
};
v.addSchema(emailSchema, '/email');

var checkData = function(schema,input){
    for(var k in schema.properties){
        if(!schema.properties[k].hasOwnProperty('type')){
            continue;
        }
        if(schema.properties[k].required && !input[k]){
            return { errors : { property : k, message : 'is required'} };
        }
        if(Array.isArray(schema.properties[k].type)){
            if(schema.properties[k].required && !Array.isArray(input[k])){
                return { errors : { property : k, message : 'must be an array of '+schema.properties[k].type[0]} };
            }
        }
        if(input[k] && typeof input[k] === 'object' && schema.properties[k].type === 'object' && schema.properties[k].hasOwnProperty('properties')){
            var o = checkData(schema.properties[k],input[k]);
            if(o.errors){
                return o;
            }
        }
    };
    return true;
};


module.exports = {
    check : function(schema,input){
        if(typeof schema !== 'object' || !schema.hasOwnProperty('properties')){
            throw new Error ("Invalid schema document");
        }
        var out = v.validate(input, schema);
        if(out.errors && out.errors.length){
            return { 
                error : errors.invalidInput,
                field : out.errors[0].property.replace(/instance\./,'')
            };
        }
        out = checkData(schema,input);
        if(out.errors && out.errors.length){
            return { 
                error : errors.invalidInput,
                field : out.errors[0].property.replace(/instance\./,'')
            };
        }
        return true;
    }
};