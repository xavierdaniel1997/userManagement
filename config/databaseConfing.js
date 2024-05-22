const mongoose  = require('mongoose');


const connectDB = () => {
    const uri = "mongodb://localhost:27017/userManagementDB"

    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("database connected successfully")
    })  
    .catch((error) => {
        console.error("Error connecting to mongoDB", error)
    })
}

module.exports = connectDB;