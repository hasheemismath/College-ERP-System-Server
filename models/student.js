const joi = require('joi');
const mongose = require('mongoose');
const {ObjectId} = mongose.Schema;


const studentSchema =  new mongose.Schema({

    user:{
        type : ObjectId,
        required : true,
        ref  : 'User'
    },
    //todo:once course has added to student status should change to verified
    course:{
        type : ObjectId,
        ref  : 'Course'

    },
    status:{
      type:String,
      enum:["pending","Cancelled","verified"],
      default:"pending"
    },
    //semester
    class :{
        type:Number,
        default: 1,
        enum: [1,2,3,4]
    },
    module:[{
        type: ObjectId,
        ref: 'Module'
    }]



},{timestamps:true});

const Student = mongose.model('Student', studentSchema);

function validateStudent(student) {
    const schema = {
        user : joi.string().required,
        course: joi.string(),
        class : joi.number(),
        status:joi.string(),
        module : joi.array()
    };


    return joi.validate(student, schema);
}

exports.Student = Student;
exports.validate = validateStudent;
