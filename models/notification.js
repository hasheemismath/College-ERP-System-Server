const joi = require('joi');
const mongose = require('mongoose');
const {ObjectId} = mongose.Schema;


const notificationSchema =  new mongose.Schema({
    instructor:{
        type : ObjectId,
        ref : 'Instructor'
    },
   assignBy:{
        type : ObjectId,
        ref : 'Admin'
   },
    is_read :{
        type : Boolean,
        default : false

    },
    //instructor accepted
    isAccepted : {
        type : Boolean,
        default : false
    }


},{timestamps:true});




const Notification = mongose.model('Notification', notificationSchema);

function validateNotification(notifi) {
    const schema = {
        instructor: joi.string().required(),
        assignBy: joi.string().required(),
        is_read: joi.boolean(),
        isAccepted : joi.boolean()
    };

    return joi.notiValidate(notifi, schema);
}

exports.Notification = Notification;
exports.notiValidate = validateNotification;
