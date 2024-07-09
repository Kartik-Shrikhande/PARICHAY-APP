//requiring or importing all needed dependencies
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require('cors');
const adminRouter = require("./src/routes/admin.Routes")
const userRouter = require("./src/routes/user.Routes")
const otpRoutes = require('./src/routes/otp.Routes')
require('dotenv').config({ path: './.env' })


app.use(express.json())
app.use(cors())
app.use('/admin', adminRouter)
app.use('/user', userRouter)
app.use('/otp', otpRoutes)


//connecting mongodb with nodejs
mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log('MongoDB is connected !!') })
    .catch((error) => { console.log(`MONGODB ERROR:${error}`) })


//creating server 
app.listen(process.env.PORT, () => {
    console.log(`App is running on port ${process.env.PORT}`)
})