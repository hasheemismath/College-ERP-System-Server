
const express = require("express");
const router = express.Router();
const {isSignIn,isAdmin,isAuthenticated} = require("../controller/auth");
const {getUserbyId} =require("../controller/user");
const {getNotify} = require("../controller/notification");

//Middleware
router.param("userID",getUserbyId)



router.get("/notify/:userID",isSignIn,isAuthenticated,getNotify)



module.exports = router;