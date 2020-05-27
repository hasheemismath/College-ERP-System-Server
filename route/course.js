

const express = require("express");
const {} = require("../controller/auth");
const router = express.Router();
const {createCourse,getCoursebyId,deleteCourse,getAllCourse,getCourse,updateCourse,AddModule,checkDupliaction} = require("../controller/course");
const {getUserbyId} = require("../controller/user");
const {isSignIn,isAdmin,isAuthenticated} = require("../controller/auth");

//param
router.param("userID",getUserbyId)
router.param("courseID",getCoursebyId);

//add course;
router.post("/course/add/:userID",isSignIn,isAuthenticated,isAdmin,createCourse);

//add existing module to the course
router.put("/course/addModule/:courseID/:userID",isSignIn,isAuthenticated,isAdmin,checkDupliaction,AddModule);

//get courses
router.get("/courses/getAll",getAllCourse)

//get course
router.get("/course/:courseID",getCourse)

//update Course
router.put("/course/:courseID",updateCourse);

//delete course
router.delete("/course/:courseID/:userID",isAdmin,deleteCourse)


module.exports = router