const _ = require('lodash');
const {User,validate} = require("../models/users");
const {Student} = require("../models/student");
const bcrypt = require("bcrypt");
const {Instructor} = require("../models/instructor");
const {Admin} = require("../models/admin");
const { sendEmail } = require('../utils/mails/index');
const fs = require("fs");

//Middleware
exports.getUserbyId = (req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                err: "No user was found"
            })
        }
        req.profile = user;
        next();
    })
};

//get user
exports.getUser = (req,res)=>{
    return res.json(req.profile)
};

exports.updateUser = async (req,res)=>{

    User.findByIdAndUpdate(
        { _id : req.profile._id},
        {$set : req.body },
        {new : true , userFindAndModify : false},
        (err,user)=>{
            if(err ){
                return res.status(400).json({
                    err : "you are not authorized to update this user"
                })
            }
            //hide all the unncessary details that you dont want show to user
            res.json(user);
        }
    )
}


exports.createUser = async (req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({email: req.body.email}) ;
    if(user) return res.status(400).send("User already Registered");
    user = new User(req.body);
    if(req.file){
        if (req.file.size > 3000000) {
            return res.status(400).json({
                error: "File size too big!"
            });
        }
        var img = fs.readFileSync(req.file.path);
        var encode_image = img.toString('base64');
        // Define a JSONobject for the image attributes for saving to database

        var finalImg = {
            contentType: req.file.mimetype,
            data:  new Buffer(encode_image, 'base64')
        };
        user.photo = finalImg
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    const _id = user._id;
    var checkInstructor = req.body.role==="instructor";
    var checkAdmin = req.body.role==="admin"

    //todo: Ref course not found validation
    try{
        await user.save();
        if(checkInstructor){
            let instructor = new Instructor({user:_id});
            await instructor.save();
            console.log("Instructor created Successfully")
        }
        if(req.body.role===undefined || req.body.role==="student"){
            let student = new Student({user:_id});
            await student.save();
            console.log("Student created Successfully")
        }
        if(checkAdmin){
            let admin = new Admin({user:_id});
            await admin.save();
            sendEmail(user.email);
            console.log("Admin created Successfully")
        }
        res.send(user)
    }catch (e) {
        res.status(400).send("Something went wrong")
    }

}

exports.getUserAvatar = async(req,res)=>{
    //todo: Should be handle the error if user doesnt have a avatar
    res.contentType('image/jpeg');
    res.send(req.profile.photo.data.buffer)
}

exports.photo = (req, res) => {
    if (req.profile.photo.data) {
        res.set("Content-Type", req.profile.photo.contentType);
        return res.status(200).send(req.profile.photo.data);
    }
    return res.status(400).json({
        error:"User dosnt have profile image"
    })
};


exports.getAllUser = async (req,res) =>{

    let limit = req.query.limit ? parseInt(req.query.limit) : 8;

    return await User
        .find()
        .populate('course',"name course_number")
        .populate('module',"name module_number")
        .limit(limit)
        .exec((err,users)=>{
            if(err){
                return res.status(400).send({
                    error : "No user found"
                })
            }
            res.json(users)
        })
}

//create module for user
//todo : Validation for adding duplicate module for the user.
exports.addModule = async (req,res)=>{
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$push:{module:req.body.module}},
        {new: true,useFindAndModify:false},
        (err,user)=>{
            if(err){
                return res.status(400).json({
                    err: "Cannot add module to this user"
                })
            }
            res.send(user)
        }
    )

}



