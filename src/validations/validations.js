const { body } = require('express-validator');

const userValidationRules = () => {
  return [
    // Email validation
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Please provide a valid email address'),

    // Password validation
    body('password') .notEmpty().withMessage('password is required')
    .isLength({ min: 8,max: 14 }).withMessage('Password must be between 8 and 14 characters long '),
    
    // Title validation
    body('title').notEmpty().withMessage('title is required')
    .isIn(['Mr', 'Miss']).withMessage('Title must be either "Mr" or "Miss"'),

    body('fullName').notEmpty().withMessage('Full name is required'),

    body('fathersName').notEmpty().withMessage('Father\'s name is required'),


    // Phone number validation
    body('phoneNumber').notEmpty().isMobilePhone().withMessage('Phone number is required')
    .isLength({ min: 10, max: 10 }).withMessage('Please provide a valid phone number'),
    
    // Gender validation
    body('gender').isIn(['Male', 'Female', 'Others']).withMessage('Gender must be either "Male", "Female", or "Others"'),

    // Date of birth validation
    body('dateOfBirth').isDate().withMessage('Please provide a valid date of birth in YYYY-MM-DD format'),

    body('birthTime').notEmpty().withMessage('Birth time is required'),


    body('nativePlace').notEmpty().withMessage('Native place is required'),

    // Height validation
    body('height').notEmpty().withMessage('Height is required'),


    body('education').notEmpty().withMessage('Education is required'),

    body('profession').notEmpty().withMessage('Profession is required'),
    body('monthlyIncome').notEmpty().withMessage('Monthly income is required'),
    body('companyName').notEmpty().withMessage('Company name is required'),
    body('fathersProfession').notEmpty().withMessage('Father\'s profession is required'),
    body('numberOfSiblings.numberOfBrothers').notEmpty().withMessage('Number of brothers is required'),
    body('numberOfSiblings.numberOfSisters').notEmpty().withMessage('Number of sisters is required'),
    body('nameOfMaternalUncle').notEmpty().withMessage('Name of maternal uncle is required'),

    // Address validation
    body('address').notEmpty().withMessage('Address is required'),


    body('correspondingAddress').notEmpty().withMessage('Corresponding address is required'),

    // Marital status validation
    body('maritalStatus').isIn(['Single', 'Married', 'Divorced', 'Widowed']).withMessage('Marital status must be one of "Single", "Married", "Divorced", or "Widowed"'),
    // Religion validation
    // body('religion').notEmpty().withMessage('Religion is required'),

    // Caste validation
    // body('caste').notEmpty().withMessage('Caste is required'),

    // Languages validation (assuming it's an array)
    // body('languages')
    // .notEmpty().withMessage('language is required')
    // .isArray().withMessage('Languages must be provided as an array'),

    // Age validation
    body('age').notEmpty().withMessage('Age is required')
    .isNumeric().withMessage('Age must be a number'),

    // body('languages').isArray({ min: 1 }).withMessage('At least one speaking language is required'),

  ];
};

module.exports = {userValidationRules};
