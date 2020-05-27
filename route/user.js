const express = require("express");
const router = express.Router();
const {createUser,getAllUser,getUserbyId,getUser,addModule,updateUser,getUserAvatar,photo} = require("../controller/user");
const {isSignIn,isAuthenticated,isAdmin,loggout} =require("../controller/auth")
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,'./uploads');
    },
    filename:function (req,file,cb) {
        cb(null,new Date().toISOString().replace(/:/g,'-') + file.originalname)

    }
})

const upload = multer({storage:storage})

//Middleware
router.param("userID",getUserbyId);

//get User
router.get("/user/:userID",getUser)

//add user;
router.post("/user/add",upload.single('photo') ,createUser);

//get user
router.get("/users/getAll",getAllUser);

//loggout user
router.get("/user/logout/:userID",isSignIn,isAuthenticated,loggout)

//get user avatar
router.get("/user/image/:userID",getUserAvatar)

//update User
router.put("/user/:userID",updateUser);


router.get("/user/photo/:userID",photo)

//addModule
// router.post("/user/module/add/:userID",addModule)





module.exports = router;