const express = require("express");
const {getModulebyId} = require("../controller/module");
const {getUserbyId} = require("../controller/user");
const router = express.Router();
const {createUser,getAllStudent,getStudentbyId,getStudent,enrollModule,updateUser,
    getStudentbyUserId,getStudentbyUser,addCourse,checkCourseDupliaction, getAllModules} = require("../controller/student");
const {isSignIn,isAuthenticated,isAdmin} =require("../controller/auth")

//Middleware
router.param("userID",getUserbyId);
router.param("studentID",getStudentbyId);

router.param("moduleID",getModulebyId)

//get User
router.get("/student/:studentID",isSignIn,getStudent);



//middleware for getStudentbyID
router.param("userId",getStudentbyUserId)

//get student by user
router.get("/student/user/:userId",getStudentbyUser);


//get all student
router.get("/students/getAll",getAllStudent);

//add course to the student
router.put("/students/addcourse/:studentID/:userID",isSignIn,isAuthenticated,isAdmin,checkCourseDupliaction,addCourse)

//update User
// router.put("/user/:userID",updateUser);
//
//
//Enrolling module
router.post("/student/enroll/:moduleID/:userID",isSignIn,isAuthenticated,enrollModule)

//get all the modules of the student
 //router.get("/student/getModule/:studentID/:userID",isSignIn,isAuthenticated,getAllModules)

 router.get("/student/getModule/:userId",getAllModules)





module.exports = router;