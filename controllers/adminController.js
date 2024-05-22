const session = require("express-session");
const Users = require("../models/userModel");
const bcrypt = require('bcrypt')


// admin login
const adminLogin = async (req, res) => {
   try{
    res.render('admin/adminLoginPage')
   }catch(error){
    console.error(error.message);
   }
}

const verifyAdmin = async (req, res) => {
   
   const {email, password} = req.body; 
   console.log(req.body);
   try{
      const userData = await Users.findOne({email: email});
      if(userData){
         const passwordMatch = await bcrypt.compare(password, userData.password);
         if(passwordMatch && userData.is_Admin===true){
            req.session.user_id = userData._id;
            // req.session.admin_id = userData._id;
            res.redirect("/admin/dashboard")   
         }else{   
            res.redirect("/admin")
         }
      }else{
         res.redirect("/admin")
      }
   }catch(error){
      console.error(error.message);     
   }
       
}


const dashboardController = async (req, res) => {
   try{
      console.log("control admin")
      const adminData = await Users.findById({_id: req.session.user_id})
      res.render("admin/adminHomePage", {data: adminData})
   }catch(error){
      console.error(error.message);
   }
}


// admin logout

const adminLogoutController = async (req, res) => {
   try{
      req.session.destroy();
      res.redirect("/admin")
   }catch(error){   
      console.error(error.message);
   }
}
 
// dashboard table

const userTableController = async (req, res) => {
   const {searchQuery} =  req.query;
   const userData = await Users.find({is_Admin: false})
   const adminData = await Users.findById(req.session.user_id)
   try{    
      if(!searchQuery){
         res.render("admin/userTablePage",{data: adminData, userData : userData})
      }else{
      //   const searchUser = await Users.find({fname: searchQuery});
      const searchUser = await Users.find({
         $or: [
             { fname: { $regex: searchQuery } }, 
             { sname: { $regex: searchQuery } },
             { email: { $regex: searchQuery } }
         ]
      });
          res.render("admin/userTablePage",{data: adminData, userData : searchUser})
      }
      // res.render("admin/userTablePage",{data: adminData, userData : userData})
   }catch(error){
      console.error(error.message);
   }
}

// add new user

const addNewUserController = async (req, res) => {
   try{
      res.render("admin/addNewUser")
   }catch(error){
      console.error(error.message);
   }
}

const addUserController = async (req, res) => {
   const {fname, sname, phone, email, password, cpassword, isAdmin} = req.body;
   try{
      if(password !== cpassword){
         res.render("admin/addNewUser", {error: "Password not match ."});
      }
      const existingUser = await Users.findOne({email: email});
      if(existingUser){
         res.render("admin/addNewUser", {error: "User already existing"})
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new Users({
         fname:fname,
         sname:sname,
         email: email,
         password: hashedPassword,
         phone: phone,
         image: req.file.filename,
         is_Admin: isAdmin,
      })
      const userData = await user.save()
      if(userData){
         res.redirect("/admin/userTable")
      }
   }catch(error){
      console.error(error.message);
   }
}


// update useres

const renderUpdatUserController = async (req, res) => {
   try{
      const id = req.query.id;
      const userData = await Users.findById({_id: id})
      if(userData){
         res.render("admin/updateUser", {user: userData});
      }else{
         res.redirect("/admin/userTable");
      }
   }catch(error){
      console.error(error.message);
   }
}

const updateUserController = async (req, res) => {
   const {fname, sname, email, phone, isAdmin, password, cpassword} = req.body
   try{
      if(password !== cpassword){
         res.render("admin/updateUser", {error: "Password not match ."});
      }
      const existingUser = await Users.findOne({email: email});
      if(existingUser){
         res.render("admin/addNewUser", {error: "User already existing"})
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const updateUserData = await Users.findByIdAndUpdate({_id:req.body.id},{$set:{
         fname:fname,
         sname: sname,
         email: email,
         phone:phone,
         password: hashedPassword,
         is_Admin: isAdmin,
      }})
      if(updateUserData){
         res.redirect("/admin/dashboard")
      }
   }catch(error){
      console.error(error.message);
   }
}

const deleteUser = async (req, res) => {
   const id = req.query.id;
   try{
      await Users.deleteOne({_id:id})
      res.redirect("/admin/userTable")

   }catch(error){
      console.error(error.message);
   }
}  


// const searchUsersController = async (req, res) => {
//    const {searchQuery} = req.query;
//    try{
//       console.log("searchQuery", searchQuery)
//    }catch(error){
//       console.error(error.message);
//    }
// }

module.exports = {adminLogin, verifyAdmin, dashboardController, adminLogoutController, userTableController, addNewUserController, addUserController, renderUpdatUserController, updateUserController, deleteUser};







/*

const verifyAdmin = async (req, res) => {
   
   const {email, password} = req.body;
  try{
   const userData = await Users.findOne({email: email});
   if(userData){
      const matchPassword = await bcrypt.compare(password, userData.password);
      if(matchPassword){
         if(userData.is_Admin===0){
            res.render("admin/adminLoginPage", {error:"Not a valid Admin"})
         }else{
            req.session.user_id = userData._id;
            res.redirect("/admin/dashboard")
         }
      }else{

      }

   }else{
      res.render("admin/adminLoginPage", {error: "Invalid email or password"})
   }
  }
  catch(error){
   console.error(error.message);
  }
       
}

*/



