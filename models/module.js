const joi = require('joi');
const mongose = require('mongoose');
const {ObjectId} = mongose.Schema;


const moduleSchema =  new mongose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        maxlength:50
    },
    credit:{
        type:Number,
    },
    description:{
        type:String,
        min:5,
        max:255
    },
    instructor:[{
        type : ObjectId,
        ref  : 'Instructor'
    }],
    key :{
        type: String,
        unique: true,
        default : function () {
            return this.name+new Date().getFullYear()
        }
    },
    assestment:[{
        type : ObjectId,
        ref : "Assestment"

    }],
    //instructor accepted
    isAccepted : {
        type : Boolean,
        default : false
    }


},{timestamps:true});

// userSchema.methods.generateAuthToken = function () {
//     const token = jwt.sign({_id: this._id}, config.get('jwtPrivateKey'));
//     return token;
// }

const Module = mongose.model('Module', moduleSchema);

function validateModule(module) {
    const schema = {
        name: joi.string().min(5).max(50).required(),
        module_number: joi.string().min(3).max(15),
        credit: joi.number(),
        description: joi.string().min(3).max(255),
        module : joi.string(),
        key : joi.string().min(6).max(15),
        assestment: joi.array(),
        instructor : joi.array(),
        isAccepted : joi.boolean()
    };

    return joi.validate(module, schema);
}

exports.Module = Module;
exports.validate = validateModule;
