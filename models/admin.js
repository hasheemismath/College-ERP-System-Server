const joi = require('joi');
const mongose = require('mongoose');
const {ObjectId} = mongose.Schema;

const adminSchema =  new mongose.Schema({

    user:{
        type : ObjectId,
        required : true,
        ref  : 'User'
    },
    experience :{
        type: Number,
    },

},{timestamps:true});


const Admin = mongose.model('Admin', adminSchema);

function validateAdmin(admin) {
    const schema = {
        user : joi.string().required,
        experience : joi.number(),
    };

    return joi.advalidate(admin, schema);
}

exports.Admin = Admin;
exports.advalidate = validateAdmin;
