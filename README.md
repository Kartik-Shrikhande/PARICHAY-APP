<h1 align="center">PARICHAY APP</h1>

<p align="center">
</p>

---
## Table of Contents
- [Overview](#overview)
- [Features](#Features)
- [Usage](#Usage)
- [Tech Stack](#Tech-Stack)
- [Prerequisites](#Prerequisites)
- [Used Cases](#Used-Cases)
- [Installation](#Installation)
- [API Endpoints](#api-endpoints)
- [License](#License)


## Overview

Parichay App is same as Matrimony Project is a web application designed to help individuals find their life partners. Users can create profiles, browse other profiles, The platform includes features for user authentication, profile management,photo uploads, subscription plans, and more. Whether you're looking for someone with a specific background, profession, or interest, our platform makes it easy to find and connect with potential matches, ensuring a safe and efficient experience.Our goal is to provide a trusted and user-friendly environment where users can find their perfect match with ease and confidence.


## Features

- User authentication (sign up, login)
- Profile creation and management
- Profile browsing and search functionality
- Subscription management
- Secure password storage and authentication using JWT
- Photo upload and management with Cloudinary
- Events for individual gatherings
- Community members



## Usage

- Open your browser and navigate to http://localhost:3000
- Sign up for a new account or log in with an existing account
- Create and manage your profile
- Browse and search for potential matches
- Subscribe to unlock additional featuresive.
- Check upcoming Events posted by community members


## Tech Stack
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage
- Multer for file uploading
- Sendgrid/mail for OTP 
- Postman for API testing
- Bcrypt for password encryption
- Express-validator for validations



## Prerequisites
Before you begin, ensure you have met the following requirements:

- Node.js and npm installed
- MongoDB installed and running
- Cloudinary account for image storage
- Sendgrid Account


## Used Cases

### For Users

1. **Register user**  :-  users can register by providing mandatory information.

3. **User login**  :-  registered users can log in using their email and password. 

5. **Search for potential matches**  :-  users can see available vaccine slots for a specific day and timings.

6. **Update profile**  :-  users can update profile such as photo, age, phone number etc.

7. **Update and reset password**  :-  user can update password and can reset password with OTP verification. 

8. **Check and Subscribe to Premium Plans**  :-  users can check and subscribed to premiumm subscription plans.

9. **Check upcoming events**  :-  user can check upcoming gatherings,events and updates from community members.

10. **Check for community members** :-  user can check comminity mmembers.



### For Admins

1. **Admin Register**  :-  Admins can register using their credentials like email and password.
   
2. **Admin Login**  :-  Admins can log in using manadatory credentials.

3. **Total Registered Users**  :-  Admins can check the total number of registered users.

4. **Create, Update, Delete, Search, Filter user**  :-  Admins have access for creating, updating, deleting, searching, filter a users.

5. **Event - Create,Update,Delete,Get Events**  :-  Admins can create events for users like gathering, meetings and upcoming updates.

6. **Community Members - Create,Update,Delete,Get Events**  :-  Admins can create, update, delete, get community members of events.

   


## Installation

1. Clone the repository:



```bash

git clone https://github.com/Kartik-Shrikhande/PARICHAY-APP.git
```



2. Install dependencies:



```bash

npm install

```



3. Set up environment variables by creating a `.env` file with your configuration.

```
PORT=3000
MONGO_URL=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SENDGRIDKEY=your_sendgrid_key
EMAIL=your_email_to_send_otp_to_user

```


4. Start the server:



```bash

npm start

```



## API Endpoints 

Here are some of the main API endpoints available in this project:

ADMINS APIs :-
- `POST /admin/signup` : Admin Signup
- `POST /admin/login` : Admin Login
- 
 Admin - Event 
- `POST /admin/create-event` : Create Event
- `PUT /admin/update-event/:id` : Update Event 
- `DELETE /admin/delete/:id` : Delete Event
- `GET /admin/all-events` : Get All Events
- `GET /admin/event/:id` : Get Event By Id

Admin - User
- `POST /admin/create-user` : Create User By Admin
- `PUT /admin/update-user/:id` : Update User By Admin
- `GET /admin/users` : Get All User By Admin
- `GET /admin/user/:id` : Get User By Id - Admin
- `DELETE /admin/user-delete/:id` : Delete User By Admin

Admin - community
- `POST /admin/create-member` : Create Community Member By Admin
- `PUT /admin/update-member/:id` :  Update Community Member By Admin
- `DELETE /admin/delete-member/:id` :  Delete Community Member By Admin
- `GET /admin/members` :  Get All Community Members By Admin


USERS APIs :-
- `POST /user/signup` : User Signup
- `POST /user/login` : User Login
- `GET /user/users` : Get All User
- `GET /user/user` : Get User
- `PUT /user/update` : Update User
- `DELETE /user/delete` : Delete User
- `POST /user/update-password` : Update Password
- `GET /user/prices` : Get Plans List
- `POST /user/subscription` : Subscribed Premium Plans
- `GET /user/user-events` : Get All Events
- `GET /user/members` : Get Community Members

 Users - OTP
- `POST /otp/otp` : Received OTP On Email
- `POST /otp/verify` : Verify OTP
- `PUT /otp/new-password` : Reset New Password


## License

This project is licensed under the MIT License. ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
---
