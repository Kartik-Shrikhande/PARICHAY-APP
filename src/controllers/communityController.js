const eventModel =require("../models/event.model")
const userModel = require("../models/user.Model");
const communityModel  =require("../models/comminityModel")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config({path:'.env'})
const cloudinary =require('../.config/cloudinary')



////////
const createCommunityMember = async (req, res) => {
    try {
        const { memberName, position } = req.body;

        // Prepare the photographs array
        const photographs = [];
        if (req.files && req.files.photograph) {
            for (const photo of req.files.photograph) {
                const photographFile = await cloudinary(photo.buffer);
                photographs.push(photographFile.secure_url);
            }
        }

        // Create new community member
        const newMember = await communityModel.create({ memberName, photograph: photographs, position });
        return res.status(201).json({ message: 'Community member created successfully', member: newMember });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

////

const updateCommunityMember = async (req, res) => {
    try {
        const memberId = req.params.id; // Assuming the member ID is passed as a route parameter

        // Retrieve the updated member details from the request body
        const { memberName, position } = req.body;

        // Check if the member exists
        const existingMember = await communityModel.findById(memberId);
        if (!existingMember) {
            return res.status(404).json({ message: 'Community member not found' });
        }

        // Update the member details
        const update = await communityModel.findOneAndUpdate(
            { _id: memberId },
            {
                $set: {
                    memberName,
                    position
                }
            },
            { new: true }
        );

        // Upload new photographs to Cloudinary if provided in the request
        if (req.files && req.files.photograph) {
            const photographs = [];
            for (const photo of req.files.photograph) {
                const photographFile = await cloudinary(photo.buffer);
                photographs.push(photographFile.secure_url);
            }
            update.photograph = photographs;
            await update.save();
        }

        return res.status(200).json({ message: 'Community member updated successfully', member: update });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//////////////

const deleteCommunityMember = async (req, res) => {
    try {
        const memberId = req.params.id; // Assuming the member ID is passed as a route parameter

        // Check if the member exists
        const existingMember = await communityModel.findById(memberId);
        if (!existingMember) {
            return res.status(404).json({ message: 'Community member not found' });
        }

        // Check if the member is already deleted
        if (existingMember.isDeleted) {
            return res.status(400).json({ message: 'Community member is already deleted' });
        }

        // Soft delete the member by setting the isDeleted flag to true
        const updatedMember = await communityModel.findOneAndUpdate(
            { _id: memberId },
            { $set: { isDeleted: true } },
            { new: true }
        );

        return res.status(200).json({ message: 'Community member deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getCommunityMembers = async (req, res) => {
    try {
        // Retrieve all community members that have not been marked as deleted
        const members = await communityModel.find({ isDeleted: false });

        // Return the list of community members in the response
        return res.status(200).json({ total: members.length, members });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



module.exports ={
  createCommunityMember,
  updateCommunityMember,
  deleteCommunityMember,
  getCommunityMembers
}


