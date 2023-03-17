const { validationResult } = require('express-validator');
const { check } = require('express-validator');

// middleware for formatting errors from express-validator middleware
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors
            .array()
            .forEach(error => errors[error.param] = error.msg);

        const err = Error('Validation error');
        err.errors = errors;
        err.status = 400;
        // err.title = 'Bad request.';
        next(err);
    }
    next();
};

// validate booking middleware
const validateBooking = [
    check('endDate')
        .custom((endDate, { req }) => {
            const [sy, sm, sd] = req.body.startDate.split('-');
            const [ey, em, ed] = endDate.split('-');

            const sDate = new Date(sy, sm - 1, sd);
            const eDate = new Date(ey, em - 1, ed);
            if (eDate.getTime() <= sDate.getTime()) {
                throw new Error('endDate cannot be on or before startDate');
            }

            return true;
        }),
    check('endDate')
        .exists({ checkFalsy: true })
        .withMessage('End date is required'),
    check('startDate')
        .exists({ checkFalsy: true })
        .withMessage('Start date is required'),
    handleValidationErrors
];

// validate review middleware
const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

// validate login middleware
const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Email or username is required'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Password is required'),
    handleValidationErrors
];

// validate spot middleware
const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name is required'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
];

// validate query filter middleware
const validateQueryFilter = [
    check('page')
        .optional({ checkFalsy: true })
        .isInt({ min: 1 })
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .optional({ checkFalsy: true })
        .isInt({ min: 1 })
        .withMessage('Size must be greater than or equal to 1'),
    check('minLat')
        .optional({ checkFalsy: true })
        .isDecimal()
        .withMessage('Minimum latitude is invalid'),
    check('maxLat')
        .optional({ checkFalsy: true })
        .isDecimal()
        .withMessage('Maximum latitude is invalid'),
    check('minLng')
        .optional({ checkFalsy: true })
        .isDecimal()
        .withMessage('Minimum longitude is invalid'),
    check('maxLng')
        .optional({ checkFalsy: true })
        .isDecimal()
        .withMessage('Maximum longitude is invalid'),
    check('minPrice')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be greater than or equal to 0'),
    handleValidationErrors
];

// validate signup middleware
const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('username')
        .exists({ checkFalsy: true })
        .withMessage('Username is required'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('First Name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Last Name is required'),
    handleValidationErrors
];

module.exports = { validateBooking, validateReview, validateLogin, validateSpot, validateQueryFilter, validateSignup };
