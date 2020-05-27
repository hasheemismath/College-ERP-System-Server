const joi = require('joi');
const mongose = require('mongoose');
const {ObjectId} = mongose.Schema;


const courseSchema =  new mongose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        maxlength:50
    },
    duration:{
        type:Number,
        default : function () {
            if(this.category ==="information Technology"){
                return 3
            }
            if(this.category === "Software Engineering"){
                return 4
            }
        }
    },
    category :{
        type : String,
        default : "information Technology",
        enum : ["information Technology","Information System","System Engineering", "Software Engineering"]
    },
    description:{
        type:String,
        trim: true,
        min:5,
        max:255
    },
    module:[{
        type: ObjectId,
        ref: "Module",
        unique:true
    }]



},{timestamps:true});



// userSchema.methods.generateAuthToken = function () {
//     const token = jwt.sign({_id: this._id}, config.get('jwtPrivateKey'));
//     return token;
// }

const Course = mongose.model('Course', courseSchema);

function validateCourse(course) {
    const schema = {
        name: joi.string().min(5).max(50).required(),
        duration: joi.number(),
        description: joi.string().min(5).max(255),
        category : joi.string(),
        module : joi.array().unique()
    };

    return joi.validate(course, schema);
}

exports.Course = Course;
exports.validate = validateCourse;
