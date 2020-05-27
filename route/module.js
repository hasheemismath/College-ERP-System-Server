
const express = require("express");
const router = express.Router();
const {isSignIn,isAdmin,isAuthenticated} = require("../controller/auth");
const {getUserbyId} =require("../controller/user");
const {createModule,AddMInstructor,getModulebyId,checkDupliaction,getAll,getModule,accpetModule} = require("../controller/module");

//Middleware
router.param("userID",getUserbyId)

router.param("moduleID",getModulebyId)

router.get("/module/getAll/:userID",getAll)

//get module
router.get("/module/:moduleID",getModule)

router.post("/module/add/:userID",isSignIn,isAuthenticated,isAdmin,createModule)

router.put("/module/addinstructor/:moduleID/:userID",isSignIn,isAuthenticated,isAdmin,checkDupliaction,AddMInstructor)

router.patch("/module/accept/:moduleID/:userID",isSignIn,isAuthenticated,accpetModule)


module.exports = router;