const joi = require('joi');
const mongose = require('mongoose');
const {ObjectId} = mongose.Schema;
// const config = require("config")
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const instructorSchema =  new mongose.Schema({

    user:{
        type : ObjectId,
        required : true,
        ref  : 'User'
    },
    //reference should come under module

    experience :{
        type: Number,
    },
    courses : [{
        type : ObjectId,
        ref: "Course"
    }]
    // module:{
    //     type: ObjectId,
    //     ref: 'Module'
    // }
    //


},{timestamps:true});




const Instructor = mongose.model('Instructor', instructorSchema);

function validateInstructor(instructor) {
    const schema = {
        user : joi.string().required,
        experience : joi.number(),
        courses : joi.array()

    };

    return joi.insvalidate(instructor, schema);
}

exports.Instructor = Instructor;
exports.insvalidate = validateInstructor;
