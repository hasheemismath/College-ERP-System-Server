const joi = require('joi');
const mongose = require('mongoose');
const {ObjectId} = mongose.Schema;


const assestmentSchema =  new mongose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        maxlength:50
    },
    duration:{
        type:Number,
    },
    description:{
        type:String,
        trim: true,
        min:5,
        max:255
    }



},{timestamps:true});



// userSchema.methods.generateAuthToken = function () {
//     const token = jwt.sign({_id: this._id}, config.get('jwtPrivateKey'));
//     return token;
// }

const Assestment = mongose.model('Assestment', assestmentSchema);

function validateAssestment(assestment) {
    const schema = {
        name: joi.string().min(5).max(50).required(),
        duration: joi.number(),
        description: joi.string().min(5).max(255)
    };

    return joi.assvalidate(assestment, schema);
}

exports.Assestment = Assestment;
exports.assvalidate = validateAssestment;
