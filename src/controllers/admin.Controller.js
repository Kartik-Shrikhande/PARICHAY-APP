const adminModel = require("../models/admin.Model");
const userModel = require("../models/user.Model");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config({path:'.env'})


const AdminSignup= async (req, res) => {
    try {
        // Extracting user input from request body
        const { email, password } = req.body;
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Enter Required Data" })
        // Check if the user already exists
        const existingUser = await adminModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creating a new user instance
        const admin = await adminModel.create({
            // AdminName,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign( { userId: admin._id},process.env.SECRET_KEY,{ expiresIn: '24h' });
        res.setHeader('Authorization', token);
        // Saving the user to the database
         return res.status(201).json({message:'sucesss',data:admin});
    }
    
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const login = async (req, res) => {
    try {
        //taking email and password
        const { email, password } = req.body
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Enter Required Data" })
        // if (!validEmail(email)) return res.status(400).send({ status: false, message: "Enter Valid Email" })
        // if (!validPassword(password)) return res.status(400).send({ status: false, message: "Enter Valid Password" })

        //checking if email already exist 
        const login = await adminModel.findOne({ email: email })
        if (!login) return res.status(404).send({ status: false, message: "Entered Email Does not Exist, Enter valid email" })

        //Matching given password with original passowrd
        const pass = bcrypt.compareSync(password, login.password)
        if (!pass) return res.status(400).send({ status: false, message: "Entered Wrong Password" })

        //Generating jsonwebtoken by signing in user
        jwt.sign({ userId: login._id }, process.env.SECRET_KEY, { expiresIn: "24hr" }, (error, token) => {
            if (error) return res.status(400).send({ status: false, message: error.message })
            res.header('authorization', token)
        
            return res.status(200).send({ staus: true, message:"User login Successfully" })
        })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const deleteUserById= async (req, res) => {
    try {
        const user =req.params.userId
        
      const findUser  = await userModel.findById(user);
      if (!findUser) {
        return res.status(404).json({ msg: 'user not found' }); 
    }
    if (findUser.isDeleted==true) return res.status(400).send({ status: false, message: "User is already Deleted" })
        //deleting blog by its Id 
    const deleteUser = await userModel.findOneAndUpdate({ _id: user, isDeleted: false }, { $set: { isDeleted: true } })
        return res.status(200).send({ status: true, message: "User is deleted" })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}
module.exports ={
    AdminSignup,
    login,
    deleteUserById,
}
