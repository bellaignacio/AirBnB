const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// GET /api/bookings (check if associated data appears)
router.get('/', async (req, res, next) => {
    const allBookings = await Booking.findAll({ include: { all: true } });
    res.json(allBookings);
});

module.exports = router;
