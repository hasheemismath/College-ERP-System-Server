const {Module,validate} = require("../models/module")
const {Notification} = require("../models/notification")

exports.getModulebyId = async(req,res,next,id)=>{
    Module.findById(id).exec((err,module)=>{
        if(err || !module){
            return res.status(400).json({
                error: "No Module was found"
            })
        }

        req.module = module;
        next();
    })
}

exports.checkDupliaction = async (req,res,next)=>{
    let instructor = req.module.instructor;
    var array=req.body.instructor;
    const keys = Object.keys(array)
    for (const key of keys) {
        let check = instructor.includes(array[key])
        if(check){
            return res.status(400).json({
                error : array[key] + " This Instructor already added to this Module"
            })
        }
    }
    next()
}

exports.getAll = async (req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;

    return await Module
        .find({isAccepted: true})
        .limit(limit)
        .exec((err,Modules)=>{
            if(err){
                return res.status(400).send({
                    error : "No Module found"
                })
            }
            res.json(Modules)
        })
}

exports.getModule = (req,res)=>{
    return res.json(req.module)
}


exports.createModule = async(req,res)=>{

    try{
        const {error} = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let module = new Module(req.body);

        await module.save();
        if (req.body.instructor) {
            if (req.body.instructor.length === 1) {
                const instructor = req.body.instructor

                let notification = new Notification({instructor, assignBy: req.profile._id})

                await notification.save();
            } else {
                let n = req.body.instructor.length
                for (let key = 0; key < n; key++) {
                    const instructor = req.body.instructor[key];
                    let notification = new Notification({instructor, assignBy: req.profile._id})
                    await notification.save();
                }
            }
        }
        res.send(module)
    }catch (e) {
        res.send(e)
    }
}

exports.AddMInstructor = async (req,res)=>{
    await Module.findByIdAndUpdate(
        {_id:req.module._id},
        {$push:{instructor:req.body.instructor}},
        {new:true,useFindAndModify:false},
        (errors,module)=>{
            if(errors){
                return res.status(400).json({
                    error: "Cannot add Instructor to this course"
                })
            }
            res.send(module)
        }
    )
}

exports.accpetModule = async(req,res)=>{
    await Module.findOneAndUpdate(
        {instructor:req.profile._id  }&& {_id: req.module._id},
        {$set:{isAccepted:true}},
        {new:true , findAndModify:false},
        (error,module)=>{
            if(error){
                return res.status(400).json({
                    error : "No module was found to accept for this Instructor "
                })
            }
            res.send(module);
        })
}