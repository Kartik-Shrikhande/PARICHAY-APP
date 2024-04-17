const eventModel =require("../models/event.model")
const userModel = require("../models/user.Model");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config({path:'.env'})
const cloudinary =require('../.config/cloudinary')


const adminLogin = async (req, res) => {
    try {
        //taking email and password
        const { email, password } = req.body
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Enter Required Data" })
        // if (!validEmail(email)) return res.status(400).send({ status: false, message: "Enter Valid Email" })
        // if (!validPassword(password)) return res.status(400).send({ status: false, message: "Enter Valid Password" })

        //checking if email already exist 
        const login = await userModel.findOne({ email: email ,type:'Admin'})
        if (!login) return res.status(404).send({ status: false, message: "Entered Email Does not Exist Or Not Admin Email" })

        //Matching given password with original passowrd
        const pass = bcrypt.compareSync(password, login.password)
        if (!pass) return res.status(400).send({ status: false, message: "Entered Wrong Password" })

        //Generating jsonwebtoken by signing in user
        jwt.sign({ userId: login._id }, process.env.SECRET_KEY, { expiresIn: "24hr" }, (error, token) => {
            if (error) return res.status(400).send({ status: false, message: error.message })
            res.header('authorization', token)
        
            return res.status(200).send({ staus: true, message:"User login Successfully" ,token:token })
        })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message})
    }
}



const createEvent = async (req, res) => {
    try {
        const { eventName, eventDetails } = req.body;
        
        const photographs = [];
        // Upload photographs to Cloudinary
        if (req.files && req.files.eventPhotograph) {
            for (const photo of req.files.eventPhotograph) {
                const photographFile = await cloudinary(photo.buffer);
                photographs.push(photographFile.secure_url);
            }
        }
        // Create new event
        const newEvent = await eventModel.create({ eventName, eventPhotograph: photographs, eventDetails });
        return res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id; // Assuming the event ID is passed as a route parameter

        // Retrieve the updated event details from the request body
        const { eventName, eventDetails } = req.body;

        // Check if the event exists
        const existingEvent = await eventModel.findById(eventId);
        if (!existingEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Update the event details
        const update = await eventModel.findOneAndUpdate(
            { _id: eventId },
            {
                $set: {
                    eventName,
                    eventDetails
                }
            },
            { new: true }
        );

        // Upload new photographs to Cloudinary if provided in the request
        if (req.files && req.files.eventPhotograph) {
            const photographs = [];
            for (const photo of req.files.eventPhotograph) {
                const photographFile = await cloudinary(photo.buffer);
                photographs.push(photographFile.secure_url);
            }
            update.eventPhotograph = photographs;
            await update.save();
        }

        return res.status(200).json({ message: 'Event updated successfully', event: update });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id; // Assuming the event ID is passed as a route parameter

        // Check if the event exists
        const existingEvent = await eventModel.findById(eventId);
        if (!existingEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if the event is already deleted
        if (existingEvent.isDeleted) {
            return res.status(400).json({ message: 'Event is already deleted' });
        }

        // Soft delete the event by setting the isDeleted flag to true
        const updatedEvent = await eventModel.findOneAndUpdate(
            { _id: eventId },
            { $set: { isDeleted: true } },
            { new: true }
        );

        return res.status(200).json({ message: 'Event deleted successfully', event: updatedEvent });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// Usage:
// app.delete('/api/events/:id', deleteEvent);

const getAllEvents = async (req, res) => {
    try {
        // Find all events that are not deleted
        const events = await eventModel.find({ isDeleted: false });

        return res.status(200).json({total:events.length, events:events });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



const getEventById = async (req, res) => {
    try {
        const eventId = req.params.id; // Assuming the event ID is passed as a route parameter

        // Find the event by its ID
        const event = await eventModel.findById(eventId);

        // Check if the event exists
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if the event is deleted
        if (event.isDeleted) {
            return res.status(404).json({ message: 'Event has been deleted' });
        }

        return res.status(200).json({ event });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Define route for getting a specific event by ID


// Define route for getting all events





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
    // AdminSignup,
    adminLogin,
    createEvent ,
    updateEvent,
    deleteEvent,
    deleteUserById,
    getAllEvents,
    getEventById
}


// const AdminSignup= async (req, res) => {
//     try {
//         // Extracting user input from request body
//         const { email, password } = req.body;
//         if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Enter Required Data" })
//         // Check if the user already exists
//         const existingUser = await adminModel.findOne({ email });
//         console.log(email,password);
//         if (existingUser) {
//             return res.status(400).json({ message: 'User with this email already exists' });
//         }

//         // Hashing the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Creating a new user instance
//         const admin = await adminModel.create({
//             // AdminName,
//             email,
//             password: hashedPassword,
//         });

//         const token = jwt.sign( { userId: admin._id},process.env.SECRET_KEY,{ expiresIn: '24h' });
//         res.setHeader('Authorization', token);
//         // Saving the user to the database
//          return res.status(201).json({message:'sucesss',data:admin});
//     }
    
//     catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }



// const login = async (req, res) => {
//     try {
//         //taking email and password
//         const { email, password } = req.body
//         if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Enter Required Data" })
//         // if (!validEmail(email)) return res.status(400).send({ status: false, message: "Enter Valid Email" })
//         // if (!validPassword(password)) return res.status(400).send({ status: false, message: "Enter Valid Password" })

//         //checking if email already exist 
//         const login = await adminModel.findOne({ email: email })
//         if (!login) return res.status(404).send({ status: false, message: "Entered Email Does not Exist, Enter valid email" })

//         //Matching given password with original passowrd
//         const pass = bcrypt.compareSync(password, login.password)
//         if (!pass) return res.status(400).send({ status: false, message: "Entered Wrong Password" })

//         //Generating jsonwebtoken by signing in user
//         jwt.sign({ userId: login._id }, process.env.SECRET_KEY, { expiresIn: "24hr" }, (error, token) => {
//             if (error) return res.status(400).send({ status: false, message: error.message })
//             res.header('authorization', token)
        
//             return res.status(200).send({ staus: true, message:"User login Successfully" })
//         })
//     }
//     catch (error) {
//         return res.status(500).send({ status: false, message: error.message })
//     }
// }