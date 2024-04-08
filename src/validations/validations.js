const { body } = require('express-validator');

const userValidationRules = () => {
  return [
    // Email validation
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Please provide a valid email address'),

    // Password validation
    body('password') .notEmpty().withMessage('password is required')
    .isLength({ min: 8,max: 14 }).withMessage('Password must be between 8 and 14 characters long '),

    // Phone number validation
    body('phoneNumber').notEmpty().isMobilePhone().withMessage('Phone number is required')
    .isLength({ min: 10, max: 10 }).withMessage('Please provide a valid phone number'),
    

    // Title validation
    body('title').notEmpty().withMessage('title is required')
    .isIn(['Mr', 'Miss']).withMessage('Title must be either "Mr" or "Miss"'),

    // Gender validation
    body('gender').isIn(['Male', 'Female', 'Others']).withMessage('Gender must be either "Male", "Female", or "Others"'),

    // Date of birth validation
    body('dateOfBirth').isDate().withMessage('Please provide a valid date of birth in YYYY-MM-DD format'),

    // Address validation
    body('address').notEmpty().withMessage('Address is required'),
    // Profession validation
    body('profession').notEmpty().withMessage('Profession is required')
    .isString().withMessage('Enter valid profession'),
    // Education validation
    body('education').notEmpty().withMessage('Education is required')
    .isString().withMessage('Enter valid profession'),
    // Marital status validation
    body('maritalStatus').isIn(['Single', 'Married', 'Divorced', 'Widowed']).withMessage('Marital status must be one of "Single", "Married", "Divorced", or "Widowed"'),
    // Religion validation
    body('religion').notEmpty().withMessage('Religion is required'),

    // Caste validation
    body('caste').notEmpty().withMessage('Caste is required'),

    // Languages validation (assuming it's an array)
    // body('languages')
    // .notEmpty().withMessage('language is required')
    // .isArray().withMessage('Languages must be provided as an array'),

    // Age validation
    body('age').notEmpty().withMessage('Age is required')
    .isNumeric().withMessage('Age must be a number'),
    // Height validation
    body('height').notEmpty().withMessage('Height is required'),
    // Income validation
    // body('income').notEmpty().withMessage('Income is required'),
    // Add more validation rules for other fields as needed
  ];
};

module.exports = {userValidationRules};
