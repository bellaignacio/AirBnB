const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Booking, Spot, User } = require('../../db/models');
const { validateBooking } = require('../../utils/validation');
const { Op } = require('sequelize');

const router = express.Router();

// DELETE /api/bookings/:bookingId (delete a booking)
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const booking = await Booking.findByPk(req.params.bookingId);

    if (!booking) {
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        return next(err);
    }

    const spot = await booking.getSpot();

    if (req.user.id !== booking.userId && req.user.id !== spot.ownerId) {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    }

    if (new Date(booking.startDate).getTime() <= new Date().getTime()) {
        const err = new Error("Bookings that have been started can't be deleted");
        err.status = 403;
        return next(err);
    }

    await booking.destroy();

    res.status(200).json({
        message: "Successfully deleted",
        statusCode: res.statusCode
    });
});

// PUT /api/bookings/:bookingId (edit a booking)
router.put('/:bookingId', requireAuth, validateBooking, async (req, res, next) => {
    const startDateInput = req.body.startDate;
    const endDateInput = req.body.endDate;
    const [sy, sm, sd] = startDateInput.split('-');
    const [ey, em, ed] = endDateInput.split('-');
    const startDateObj = new Date(sy, sm - 1, sd);
    const endDateObj = new Date(ey, em - 1, ed);

    const booking = await Booking.findByPk(req.params.bookingId);

    if (!booking) {
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        return next(err);
    }

    if (req.user.id !== booking.userId) {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    }

    if (new Date(booking.endDate).getTime() <= new Date().getTime()) {
        const err = new Error("Past bookings can't be modified");
        err.status = 403;
        return next(err);
    }

    const spot = await booking.getSpot();

    let conflictingStartDate = await spot.getBookings({
        where: {
            startDate: {
                [Op.lte]: startDateObj
            },
            endDate: {
                [Op.gte]: startDateObj
            }
        }
    });

    let conflictingEndDate = await spot.getBookings({
        where: {
            startDate: {
                [Op.lte]: endDateObj
            },
            endDate: {
                [Op.gte]: endDateObj
            }
        }
    });

    if (conflictingStartDate.length || conflictingEndDate.length) {
        const err = new Error('Sorry, this spot is already booked for the specified dates');
        err.status = 403;
        err.errors = {};
        if (conflictingStartDate.length) err.errors.startDate = 'Start date conflicts with an existing booking';
        if (conflictingEndDate.length) err.errors.endDate = 'End date conflicts with an existing booking';
        return next(err);
    }

    booking.set({
        startDate: startDateObj,
        endDate: endDateObj
    });

    await booking.save();

    res.json(booking);
});

// GET /api/bookings/current (get all of the current user's bookings)
router.get('/current', requireAuth, async (req, res, next) => {
    const currentUser = await User.getCurrentUserById(req.user.id);
    const allBookings = await currentUser.getBookings({
        include: {
            model: Spot,
            attributes: {
                exclude: ['description', 'createdAt', 'updatedAt']
            }
        }
    });

    for (let i = 0; i < allBookings.length; i++) {
        const booking = allBookings[i];
        const spot = await booking.getSpot();
        booking.dataValues.Spot.dataValues.previewImage = await spot.getPreviewImages();
    }

    res.json({
        Bookings: allBookings
    });
});

module.exports = router;
