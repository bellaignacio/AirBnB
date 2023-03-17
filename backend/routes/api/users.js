const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

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

// POST /api/users (sign up a user)
router.post('/', validateSignup, async (req, res, next) => {
    const { firstName, lastName, email, password, username } = req.body;

    let existingEmail = await User.findOne({
        where: { email: email }
    });

    let existingUsername = await User.findOne({
        where: { username: username }
    });

    if (existingEmail || existingUsername) {
        // const err = new Error('User already exists');
        // err.status = 403;
        // err.title = 'User already exists';
        // err.errors = {};
        // if (existingEmail) err.errors.email = 'User with that email already exists';
        // if (existingUsername) err.errors.username = 'User with that username already exists';
        // return next(err);
        const err = new Error('User already exists');
        err.status = 403;
        err.errors = {};
        if (existingEmail) err.errors.email = 'User with that email already exists';
        if (existingUsername) err.errors.username = 'User with that username already exists';
        return next(err);
    }

    const user = await User.signup({ firstName, lastName, email, password, username });
    const token = await setTokenCookie(res, user);

    return res.json({
        id: user.id,
        firstName,
        lastName,
        email,
        username,
        token
    });
});

// GET /api/users (check if associated data appears)
// router.get('/', async (req, res, next) => {
//     const allUsers = await User.findAll({ include: { all: true } });
//     res.json(allUsers);
// });

module.exports = router;
