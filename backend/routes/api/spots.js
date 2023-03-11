const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// GET /api/spots (check if associated data appears)
router.get('/', async (req, res, next) => {
    const allSpots = await Spot.findAll({ include: { all: true } });
    res.json(allSpots);
});

module.exports = router;
