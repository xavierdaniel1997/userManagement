const Users = require("../models/userModel");
const bcrypt = require("bcrypt");

// user registration
const registerUser = async (req, res) => {
  try {
    res.render("user/registration");
  } catch (error) {
    console.error(error.message);
  }
};

const registrationController = async (req, res) => {
  console.log(req.body);
  const { fname, sname, phone, email, password, cpassword } = req.body;
  try {
    if (password !== cpassword) {
      res.render("user/registration", { error: "Password not match ." });
    }
    const existingUser = await Users.findOne({ email: email });
    if (existingUser) {
      res.render("user/registration", { error: "user already exisiting ." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Users({
      fname: fname,
      sname: sname,
      email: email,
      password: hashedPassword,
      phone: phone,
      image: req.file.filename,
      is_Admin: false,
    });
    const userData = await user.save();

    if (userData) {
      // res.render("user/registration", {message: "Registered Successfully !"});
      res.redirect("/");
    } else {
      res.render("user/registration", { error: "something worong" });
    }
  } catch (error) {
    console.error("Something wrong happends", error);
  }
};

// user login
const loginController = async (req, res) => {
  try {
    res.render("user/login");
  } catch (error) {
    console.error(error.message);
  }
};

const verifyLoginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userData = await Users.findOne({ email: email });
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch && userData.is_Admin === false) {
        (req.session.user_id = userData._id),
          // req.session.is_Admin = userData.is_Admin
          res.redirect("/home");
      } else {
        res.render("user/login", { error: "Not a valid user" });
      }
    } else {
      res.render("user/login", { error: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error.message);
  }
};

const homeController = async (req, res) => {
  try {
    const userData = await Users.findById({ _id: req.session.user_id });
    res.render("user/home", { data: userData });
  } catch (error) {
    console.error(error.message);
  }
};

// user logout
const userLogout = async (req, res) => {
  try {
    // req.session.destroy();

    req.session.user_id = null;

    res.redirect("/");
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  registerUser,
  registrationController,
  loginController,
  verifyLoginUser,
  homeController,
  userLogout,
};


