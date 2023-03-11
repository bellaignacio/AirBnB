const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// GET /api/reviews (check if associated data appears)
router.get('/', async (req, res, next) => {
    const allReviews = await Review.findAll({ include: { all: true } });
    res.json(allReviews);
});

module.exports = router;
