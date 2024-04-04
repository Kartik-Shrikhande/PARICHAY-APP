//requiring or importing all needed dependencies
const express = require("express")
const app = express()
const mongoose = require("mongoose")

const userRouter = require("./routes/user.Routes")
require('dotenv').config({path:'./.env'})
console.log("line 8");
//parsing data in jason format
app.use(express.json())
console.log("line 11");
// app.use('/', router)
app.use('/user',userRouter)
console.log("line 14");

//connecting mongodb with nodejs
mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log('MongoDB is connected !!') })
    .catch((error) => { console.log(`MONGODB ERROR:${error}`); })

//creating server 
app.listen(process.env.PORT, () => {
    console.log(`App is running on port ${process.env.PORT}`);
})