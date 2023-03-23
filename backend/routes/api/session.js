const express = require('express');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { validateLogin } = require('../../utils/validation');

const router = express.Router();

// POST /api/session (log in a user)
router.post('/', validateLogin, async (req, res, next) => {
    const { credential, password } = req.body;
    const user = await User.login({ credential, password });

    if (!user) {
        const err = new Error('Invalid credentials');
        err.status = 401;
        return next(err);
    }

    await setTokenCookie(res, user);

    return res.json({
        user: user.toSafeObject()
    });
});

// DELETE /api/session (log out a user)
router.delete('/', (_req, res) => {
        res.clearCookie('token');
        return res.json({ message: 'success' });
    }
);

// GET /api/session (get the current user)
router.get('/', requireAuth, restoreUser, (req, res) => {
    const { user } = req;
    if (user) {
        return res.json({
            user: user.toSafeObject()
        });
    } else {
        return res.json({
            user: null
        });
    }
});

module.exports = router;
