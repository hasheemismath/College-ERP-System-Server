const joi = require('joi');
const mongose = require('mongoose');
const {ObjectId} = mongose.Schema;


const marksSchema =  new mongose.Schema({
    mark:{
        type:Number,
        required: true
    },
    assestment: {
        type:ObjectId,
        ref: "Assestment"
    },
    student :{
        type: ObjectId,
        ref : "Student"
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

const Mark = mongose.model('mark', marksSchema);

function validateMark(mark) {
    const schema = {
        mark: joi.number.required(),
        assvalidate : joi.string.required(),
        description: joi.string().min(5).max(255),
        student : joi.string.required()
    };

    return joi.markvalidate(mark, schema);
}

exports.Mark = Mark;
exports.markvalidate = validateMark;
