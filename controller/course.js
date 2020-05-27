const {Course,validate} = require("../models/course");



exports.getCoursebyId = (req,res,next,id)=>{
    Course.findById(id).exec((err,course)=>{
        if(err || !course){
            return res.status(400).json({
                err: "No course was found"
            })
        }

        req.course = course;
        next();
    })
}

exports.checkDupliaction = async (req,res,next)=>{
    let module = req.course.module;
    var array=req.body.module;
    const keys = Object.keys(array)
    for (const key of keys) {
        let check = module.includes(array[key])
        if(check){
            return res.status(400).json({
                error : array[key] + " Module already added to this course"
            })
        }
    }
     next()
}

exports.createCourse = async (req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);



    let course = new Course(req.body);

    await course.save();
    res.send(course)
}

exports.AddModule = async (req,res)=>{
    await Course.findByIdAndUpdate(
        {_id:req.course._id},
        {$push:{module:req.body.module}},
        {new:true,useFindAndModify:false},
        (errors,course)=>{
            if(errors){
                return res.status(400).json({
                    error: "Cannot add module to this course"
                })
            }
            res.send(course)
        }
    )
}

exports.getAllCourse =  async (req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;

    return await Course
        .find()
        .limit(limit)
        .exec((err,courses)=>{
            if(err){
                return res.status(400).send({
                    error : "No course found"
                })
            }
            res.json(courses)
        })
}

exports.getCourse = (req,res)=>{
    return res.json(req.course)
}

//update the course
exports.updateCourse = (req,res)=>{
    Course.findByIdAndUpdate(
        {_id: req.course._id},
        {$set : req.body},
        {new:true , findAndModify:false},
            (error,course)=>{
                if(error){
                    return res.status(400).json({
                        error : "No Course was found for Update"
                    })
                }
                res.send(course);
            }
    )
}

exports.deleteCourse = async (req,res)=>{
    let course = req.course;
    await course.remove((err, deletedCourse) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to delete the Course"
            });
        }
        res.json({
            message: "Deletion was a success",
            deletedCourse
        });
    });
}