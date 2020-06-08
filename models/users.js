const joi = require('joi');
const mongose = require('mongoose');
const {ObjectId} = mongose.Schema;
const jwt = require('jsonwebtoken');

const userSchema =  new mongose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        maxlength:50
    },
    gender :{
      type: String,
      enum : ["Male","Female"]
    },
    email:{
        type: String,
        unique:true,
        required:true,
        trim:true,
        minlength: 5,
        maxlength: 255,
    },
    dob:{
      type: String,
    },
    password:{
        type:String,
        required:true,
        minlength:5,
        maxlength:1024
    },
    user_number:{
        type: String,
        trim:true,
        min:3,
        max:15
        // unique: true
    },
    profile:{
        data: Buffer,
        contentType: String
    },
    mobile:{
        type:String,
        trim:true,
        length:10,
    },
    address : {
      address_line :{
          type:String
      },
      city : {
          type: String,
      },
      state :{
          type: String
      }
    },
    isAdmin:{
        type: Boolean,
        default : function () {
            return this.role==="admin"
        }
    },
    role: {
        type: String,
        default: 'student',
        enum: ["student", "instructor", "admin"],
        validate:function (v) {
                return v==="student" || "instructor" || "admin"
        },
        message :"Role name should be enum value"
    },
    photo: {
        data: Buffer,
        contentType: String
    }

},{timestamps:true});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id}, process.env.SECRET);
    return token;
}

const User = mongose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        name: joi.string().min(5).max(50).required(),
        email: joi.string().required().email(),
        password: joi.string().min(5).max(255).required(),
        role:joi.string(),
        gender : joi.string(),
        dob: joi.string(),
        address : joi.string()
    };

    return joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
