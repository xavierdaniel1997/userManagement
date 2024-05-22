const express = require('express');
const multer = require('multer')
const path = require('path');
const userRoute = express.Router();  
 

const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const cachaClearMid = require("../middleware/cachaClearMid")

// userRoute.get(["/", "/register", "/login", "/logout" ,"/home"],auth.   noCacheMiddleware) 
userRoute.get(["/", "/register", "/login", "/logout" ,"/home"],cachaClearMid.noCacheMiddleware)
// userRoute.use(cachaClearMid.noCacheMiddleware);

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, "../public/assets/userImages"))
    },  
    filename: function(req, file, cb){
        const name = Date.now()+"-"+file.originalname;
        cb(null, name)    
    }
})
const upload = multer({storage:storage});
   


userRoute.get("/register", auth.isLogout,userController.registerUser);

userRoute.post("/register",upload.single('image'), userController.registrationController)

userRoute.get("/", auth.isLogout,userController.loginController);

userRoute.post("/login", userController.verifyLoginUser)

userRoute.get("/home", auth.isLogin,userController.homeController) 

userRoute.get("/logout", auth.isLogin,userController.userLogout);



module.exports = userRoute;        