const {Notification} = require("../models/notification");

exports.getNotify = async(req,res)=>{
    await Notification.findOne({instructor:req.profile._id}).exec((error,notify)=>{
        if(error || !notify){
            return res.status(400).json({error : "coulnt find it"})
        }
        res.send(notify)
    });


}

