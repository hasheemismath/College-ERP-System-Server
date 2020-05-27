const _ = require('lodash');
const {User} = require("../models/users");
const bcrypt = require("bcrypt")
const joi = require("joi");

const jwt = require('jsonwebtoken');

//Middleware : Signin check
exports.isSignIn = (req, res, next) =>{
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token,process.env.SECRET);
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid token.');
    }
}

//custom middleware
exports.isAuthenticated = (req,res,next)=>{
    let checker = req.profile && req.user && req.profile._id == req.user._id ;
    if(!checker){
        return res.status(403).json({
            error: "Access denied"
        })
    }
    next();
};

//middleware : admin check
exports.isAdmin = (req,res,next)=>{
    if(!req.profile.isAdmin){
        return res.status(400).json({
            error : "You are not authorized. Get the Fuck out of here"
        })
    }
    next();
}



// signin/ add user
exports.signin = async (req,res)=>{
    function validate(req) {
        const schema = {
            email: joi.string().min(5).max(255).required().email(),
            password: joi.string().min(5).max(255).required()
        };

        return joi.validate(req, schema);
    }
    const { error } = validate(req.body);
    if (error) return res.status(400).json({error:error.details[0].message});

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({error: 'Invalid email or password.'});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({error : 'Invalid email or password.'});

    const token = user.generateAuthToken();
     // res.send(token);
    res.cookie("token",token,{expire:new Date()+9999});
    //send response to frontend
    const {_id,email,name,role,isAdmin} = user;
    return res.send({token,user:{_id,name,email,role,isAdmin}})
}

//logging out the user
exports.loggout = (req,res)=>{
    res.clearCookie("token");
    res.json({
        message : "Sign out successfully "
    })
}