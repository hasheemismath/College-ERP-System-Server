const _ = require('lodash');
const {User} = require("../models/users");
const {Module} = require("../models/module")
const {Student,validate} = require("../models/student");
const bcrypt = require("bcrypt");
const {Course} = require("../models/course");
const {Instructor} = require("../models/instructor");
const {Admin} = require("../models/admin");
const mongoose = require('mongoose')

//Middleware
exports.getStudentbyId = (req,res,next,id)=>{
    Student.findById(id).exec((err,student)=>{
        if(err || !student){
            return res.status(400).json({
                err: "No student was found"
            })
        }
        req.student = student;
        next();
    })
};

exports.checkCourseDupliaction = async (req,res,next)=>{
    let course = req.student.course;
    var addingCourse=req.body.course;

    var eq = JSON.stringify(course) === JSON.stringify(addingCourse) ;
    if(eq){
        return res.status(400).json({
            error : "This course already added to this Student"
        })
    }
     next()
}



//get user
exports.getStudent = (req,res)=>{
    return res.json(req.student)
};

exports.getStudentbyUserId = (req,res,next,userId)=>{
    Student.find({user:userId}).exec((err,student)=>{
        if(err || !student){
            return res.status(400).json({
                err: "No student was found"
            })
        }
        req.student = student;
        next();
    })
};

exports.getStudentbyUser = (req,res)=>{
    return res.json(req.student)
};

exports.addCourse = async(req,res)=>{
    await Student.findOne(
        {_id:req.body._id},
        async function (err) {
            if(err){
                return res.status(400).json({
                    err: "Cannot add course to this Student"
                })
            }
            req.student.course=req.body.course;
            await req.student.save()
                .then(async () => {
                    await res.send(req.student);
                }).catch((err) => {
                    if (err) {
                        res.status(400).send(err._message);
                    }
                });
        }
    )
}


exports.getAllStudent = async (req,res) =>{

    let limit = req.query.limit ? parseInt(req.query.limit) : 8;

    return await Student
        .find()
        .populate('user'," -_id name email")
        .limit(limit)
        .exec((err,students)=>{
            if(err){
                return res.status(400).send({
                    error : "No student found"
                })
            }
            res.json(students)
        })
}

//create module for user
//todo : Validation for adding duplicate module for the user.
exports.enrollModule = async (req,res)=>{
    await Module.findOne(
        {_id:req.module},
        async function (err,module) {
            let checkingKey = module.key === req.body.key;
            if(checkingKey){
                await Student.findOneAndUpdate(
                    {user:req.profile._id},
                    {$push:{module:req.module._id}},
                    {new : true , useFindAndModify:false},
                    (error,student)=>{
                        if(error){
                            return res.status(400).json({
                                error : "Student not found"
                            })
                        }
                        res.send(student)
                    })

            }
            if(!checkingKey){
                return res.status(400).json({
                    error : "Invalid Enrollment key"
                })
            }
        }
    )

}

//get all the modules of the student
exports.getAllModules = (req,res)=>{

    Module.find({'_id': {$in: req.student[0].module}},
        async function (err,module) {
            if(err){
                res.status(400).json({
                    error : "cannot find the module"
                })
            }
            res.send(module)
        })

}
