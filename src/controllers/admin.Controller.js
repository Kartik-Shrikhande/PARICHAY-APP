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


///////done above all


const adminCreateUser = async (req, res) => {
    try {
        // Destructure the required fields from the request body
        const { email, password, title, fullName, fathersName, phoneNumber, gender, dateOfBirth, birthTime, nativePlace, height, education, profession, monthlyIncome, companyName, fathersProfession, numberOfSiblings, nameOfMaternalUncle, address, correspondingAddress, maritalStatus, age, religion, caste, languages, aboutMe } = req.body;

        // Check if all required fields are present
        if (!email || !password || !title || !fullName || !fathersName || !phoneNumber || !gender || !dateOfBirth || !birthTime || !nativePlace || !height || !education || !profession || !monthlyIncome || !companyName || !fathersProfession || !numberOfSiblings || !nameOfMaternalUncle || !address || !correspondingAddress || !maritalStatus || !age || !religion || !caste || !languages || !aboutMe) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if the user already exists
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = await userModel.create({
            email, password: hashedPassword, title, fullName, fathersName, phoneNumber, gender, dateOfBirth, birthTime, nativePlace, height, education, profession, monthlyIncome, companyName, fathersProfession, numberOfSiblings, nameOfMaternalUncle, address, correspondingAddress, maritalStatus, age, religion, caste, languages, aboutMe
        });

        // Return the success response
        return res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const adminUpdateUser = async (req, res) => {
    try {
        const userId = req.params.id; 

        // Check if the user exists
        const findUser = await userModel.findById(userId);
        if (!findUser) {
            return res.status(404).json({ message: 'User not found' });
        }


        // If user profile already exists, update it
        let { 
            // email, password, phoneNumber, title, fullName, gender, dateOfBirth, address, profession,
            // education, caste, age, height, income
            title,
            fullName,
            fathersName,
            phoneNumber,
            gender,
            dateOfBirth,
            birthTime,
            nativePlace,
            height,
            education,
            profession,
            monthlyIncome,
            companyName,
            fathersProfession,
            numberOfSiblings,
            nameOfMaternalUncle,
            address,
            correspondingAddress,
            maritalStatus,
            age
        } = req.body

            // const {photograph} = req.files
            const photographs = [];
            if (req.files && req.files.photograph) {
                for (const photo of req.files.photograph) {
                    const photographFile = await cloudinary(photo.buffer);
                    photographs.push(photographFile.secure_url);
                }
            }
   
      

        // update blog document
        let update = await userModel.findOneAndUpdate({ _id: userId },
            {
                $set:
              
                title,
                fullName,
                fathersName,
                phoneNumber,
                gender,
                dateOfBirth,
                birthTime,
                nativePlace,
                height,
                education,
                profession,
                monthlyIncome,
                companyName,
                fathersProfession,
                numberOfSiblings,
                nameOfMaternalUncle,
                address,
                correspondingAddress,
                maritalStatus,
                age,
                photograph: photographs
            },
            { new: true })
        return res.status(200).send({ status: true, message: 'User is updated', update })
    }

    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// const adminDeleteUser = async (req, res) => {
//     try {
//         const userId = req.params.id; // Assuming the user ID is passed as a route parameter

//         // Check if the user exists
//         const existingUser = await userModel.findById(userId);
//         if (!existingUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Soft delete the user by setting the isDeleted flag to true
//         existingUser.isDeleted = true;
//         await existingUser.save();

//         // Return the success response
//         return res.status(200).json({ message: 'User deleted successfully' });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };

const adminGetAllUsers = async (req, res) => {
    try {
        const {
            minAge,maxAge,
            minSalary,maxSalary,
            // minHeight,maxHeight,
            // caste,
            gender,
            // maritalStatus
        } = req.query
        
       let data ={};
       if(minAge && maxAge ){
        data.age ={$gte:minAge,$lte :maxAge}
       };

        
       if(minSalary && maxSalary ){
        data.monthlyIncome ={$gte:minSalary,$lte :maxSalary}
       };


       if(gender){
        data.gender=gender
       };


        const users = await userModel.find({ isDeleted: false, ...data });
        res.status(200).json({ total: users.length, data: users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}




const adminGetUserById = async (req, res) => {
    try {
        const userId = req.params.id; // Assuming the user ID is passed as a route parameter

        // Fetch the user by ID
        const user = await userModel.findById(userId);

        // Check if the user exists and is not deleted
        if (!user || user.isDeleted) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user details
        return res.status(200).json({ user: user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const deleteUserById= async (req, res) => {
    try {
        const user =req.params.id
        
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
    getAllEvents,
    getEventById,
    adminCreateUser,
    adminUpdateUser,
    adminGetAllUsers,
    adminGetUserById,
    deleteUserById,
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