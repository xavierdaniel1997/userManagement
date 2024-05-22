const express = require('express');
const session = require('express-session')

const connectDB = require('./config/databaseConfing')
const adminRoute = require('./routers/adminRoute')
const userRoute = require('./routers/userRoute');
// const noCacheMiddleware = require('./middleware/auth');

const app = express();   
const PORT = 3000;

connectDB()    

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.static('public/style'))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'my_secret',
    resave: false,
    saveUninitialized: true,
}))

app.use("/admin", adminRoute)
app.use("/", userRoute)

app.listen(PORT, () => {
    console.log(`server start running at localhost:${PORT}`)
})