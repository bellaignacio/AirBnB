const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// GET /api/spot-images (check if associated data appears)
router.get('/', async (req, res, next) => {
    const allSpotImages = await SpotImage.findAll({ include: { all: true } });
    res.json(allSpotImages);
});

module.exports = router;
