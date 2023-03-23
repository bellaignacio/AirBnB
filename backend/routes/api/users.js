const express = require('express');
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');
const { validateSignup } = require('../../utils/validation');

const router = express.Router();

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
        ...user.toSafeObject(),
        token
    });
});

module.exports = router;
