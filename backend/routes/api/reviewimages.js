const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// GET /api/review-images (check if associated data appears)
router.get('/', async (req, res, next) => {
    const allReviewImages = await ReviewImage.findAll({ include: { all: true } });
    res.json(allReviewImages);
});

module.exports = router;
