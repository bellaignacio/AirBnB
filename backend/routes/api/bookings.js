const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Spot } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const router = express.Router();

// validate booking middleware
const validateBooking = [
    check('endDate')
        .custom((endDate, { req }) => {
            const [sy, sm, sd] = req.body.startDate.split('-');
            const [ey, em, ed] = endDate.split('-');

            const sDate = new Date(sy, sm - 1, sd);
            const eDate = new Date(ey, em - 1, ed);
            if (eDate.getTime() <= sDate.getTime()) {
                throw new Error('endDate cannot be on or before startDate');
            }

            return true;
        }),
    check('endDate')
        .exists({ checkFalsy: true })
        .withMessage('End date is required'),
    check('startDate')
        .exists({ checkFalsy: true })
        .withMessage('Start date is required'),
    handleValidationErrors
];

// DELETE /api/bookings/:bookingId (delete a booking)
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const booking = await Booking.findByPk(req.params.bookingId);

    if (!booking) {
        // const err = new Error("Booking couldn't be found");
        // err.status = 404;
        // err.title = "Booking couldn't be found";
        // return next(err);
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        return next(err);
    }

    const spot = await booking.getSpot();

    if (req.user.id !== booking.userId && req.user.id !== spot.ownerId) {
        // const err = new Error('Booking and Spot does not belong to current user');
        // err.status = 403;
        // err.title = 'Booking and Spot does not belong to current user';
        // return next(err);
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    }

    if (new Date(booking.startDate).getTime() <= new Date().getTime()) {
        // const err = new Error("Bookings that have been started can't be deleted");
        // err.status = 403;
        // err.title = "Bookings that have been started can't be deleted";
        // return next(err);
        const err = new Error("Bookings that have been started can't be deleted");
        err.status = 403;
        return next(err);
    }

    await booking.destroy();

    res.status(200);
    res.json({
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
        // const err = new Error("Booking couldn't be found");
        // err.status = 404;
        // err.title = "Booking couldn't be found";
        // return next(err);
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        return next(err);
    } else if (req.user.id !== booking.userId) {
        // const err = new Error('Booking does not belong to current user');
        // err.status = 403;
        // err.title = 'Booking does not belong to current user';
        // return next(err);
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    }

    if (new Date(booking.endDate).getTime() <= new Date().getTime()) {
        // const err = new Error("Past bookings can't be modified");
        // err.status = 403;
        // err.title = "Past bookings can't be modified";
        // return next(err);
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
        // const err = new Error('Sorry, this spot is already booked for the specified dates');
        // err.status = 403;
        // err.title = 'Sorry, this spot is already booked for the specified dates';
        // err.errors = {};
        // if (conflictingStartDate.length) err.errors.startDate = 'Start date conflicts with an existing booking';
        // if (conflictingEndDate.length) err.errors.endDate = 'End date conflicts with an existing booking';
        // return next(err);
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
    const allBookings = await Booking.findAll({
        where: { userId: req.user.id },
        include: {
            model: Spot,
            attributes: {
                exclude: ['description', 'createdAt', 'updatedAt'] // NEED TO ADD PREVIEW IMAGE
            }
        }
    });

    for (let i = 0; i < allBookings.length; i++) {
        const booking = allBookings[i];
        const spotImages = await booking.Spot.getSpotImages();
        const allPreviewImages = [];
        spotImages.forEach(async image => {
            if (image.preview) allPreviewImages.push(image.url)
        });
        booking.dataValues.Spot.dataValues.previewImage = allPreviewImages;
    }

    res.json({
        Bookings: allBookings
    });
});

// GET /api/bookings (check if associated data appears)
// router.get('/', async (req, res, next) => {
//     const allBookings = await Booking.findAll({ include: { all: true } });
//     res.json(allBookings);
// });

module.exports = router;
