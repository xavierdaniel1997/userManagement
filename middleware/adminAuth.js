

const isAdminLogin = async (req, res, next) => {
    if(!req.session.user_id && userData.is_Admin===true){
        console.log("middlewar used")
        res.redirect("/admin")
    }
    next();
}

// const isAdminLogin = async (req, res, next) => {
//     if(req.session.admin_id){
//         console.log("first", req.session.admin_id)
//         console.log("middlewar used")
//         next();
//     }else{
//         res.redirect("/admin")
//     }    
// } 

const isAdminLogout = async (req, res, next) => {
    if(req.session.user_id){  
        res.redirect("/admin/dashboard")
    }
    next()
}

module.exports = {isAdminLogin, isAdminLogout} 