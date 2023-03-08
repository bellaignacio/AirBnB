const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// POST /api/users (signup)
router.post('/', async (req, res, next) => {
    const { firstName, lastName, email, password, username } = req.body;
    const user = await User.signup({ firstName, lastName, email, password, username });

    await setTokenCookie(res, user);

    return res.json({
        user: user
    });
});


module.exports = router;
