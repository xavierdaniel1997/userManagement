const express  = require('express');
const adminRoute = express.Router();
const adminController = require('../controllers/adminController')
const adminAuth = require("../middleware/adminAuth")
const cachaClearMid = require("../middleware/cachaClearMid")
const multer = require('multer')
const path = require('path');


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
// adminRoute.get(["/", "/dashboard", "/adminlogin", "/adminLogout"], cachaClearMid.noCacheMiddleware)
adminRoute.use(cachaClearMid.noCacheMiddleware);

adminRoute.get("/",adminAuth.isAdminLogout,adminController.adminLogin)
 
adminRoute.post("/adminlogin", adminController.verifyAdmin);     


adminRoute.get("/dashboard", adminAuth.isAdminLogin,adminController.dashboardController); 

adminRoute.get("/userTable", adminAuth.isAdminLogin, adminController.userTableController);

adminRoute.get("/addUser", adminAuth.isAdminLogin, adminController.addNewUserController);

adminRoute.post("/addUser",upload.single('image'),adminController.addUserController);

adminRoute.get("/updateUser", adminAuth.isAdminLogin, adminController.renderUpdatUserController);

adminRoute.post("/editUser", adminController.updateUserController);

adminRoute.get("/deletUser", adminAuth.isAdminLogin,adminController.deleteUser)

// adminRoute.get("/searchUser", adminAuth.isAdminLogin, adminController.searchUsersController)

// adminRoute.get("*", (req, res) => {   
//     res.redirect("/admin")       
// }) 

adminRoute.get("/adminLogout", adminController.adminLogoutController)
 
module.exports = adminRoute;     