const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, ReviewImage, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const router = express.Router();

// validate spot middleware
const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name is required'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
];

// validate review middleware
const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

// validate query filter middleware
const validateQueryFilter = [
    check('page')
        .optional({ checkFalsy: true })
        .isInt({ min: 1 })
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .optional({ checkFalsy: true })
        .isInt({ min: 1 })
        .withMessage('Size must be greater than or equal to 1'),
    check('minLat')
        .optional({ checkFalsy: true })
        .isDecimal()
        .withMessage('Minimum latitude is invalid'),
    check('maxLat')
        .optional({ checkFalsy: true })
        .isDecimal()
        .withMessage('Maximum latitude is invalid'),
    check('minLng')
        .optional({ checkFalsy: true })
        .isDecimal()
        .withMessage('Minimum longitude is invalid'),
    check('maxLng')
        .optional({ checkFalsy: true })
        .isDecimal()
        .withMessage('Maximum longitude is invalid'),
    check('minPrice')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be greater than or equal to 0'),
    handleValidationErrors
];

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

// DELETE /api/spots/:spotId (delete a spot)
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        // const err = new Error("Spot couldn't be found");
        // err.status = 404;
        // err.title = "Spot couldn't be found";
        // return next(err);
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    } else if (req.user.id !== spot.ownerId) {
        // const err = new Error('Spot does not belong to current user');
        // err.status = 403;
        // err.title = 'Spot does not belong to current user';
        // return next(err);
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    }

    await spot.destroy();

    res.status(200);
    res.json({
        message: "Successfully deleted",
        statusCode: res.statusCode
    });
});

// PUT /api/spots/:spotId (edit a spot)
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        // const err = new Error("Spot couldn't be found");
        // err.status = 404;
        // err.title = "Spot couldn't be found";
        // return next(err);
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    } else if (req.user.id !== spot.ownerId) {
        // const err = new Error('Spot does not belong to current user');
        // err.status = 403;
        // err.title = 'Spot does not belong to current user';
        // return next(err);
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    }

    spot.set({
        address, city, state, country, lat, lng, name, description, price
    });
    await spot.save();

    res.json(spot);
});

// POST /api/spots/:spotId/images (add an image to a spot based on the spot's id)
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const { url, preview } = req.body;
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        // const err = new Error("Spot couldn't be found");
        // err.status = 404;
        // err.title = "Spot couldn't be found";
        // return next(err);
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    } else if (req.user.id !== spot.ownerId) {
        // const err = new Error('Spot does not belong to current user');
        // err.status = 403;
        // err.title = 'Spot does not belong to current user';
        // return next(err);
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    }

    const newImage = await spot.createSpotImage({
        url, preview
    });

    res.json({
        id: newImage.id,
        url,
        preview
    });
});

// POST /api/spots/:spotId/bookings (create a booking from a spot based on the spot's id)
router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res, next) => {
    const startDateInput = req.body.startDate;
    const endDateInput = req.body.endDate;
    const [sy, sm, sd] = startDateInput.split('-');
    const [ey, em, ed] = endDateInput.split('-');
    const startDateObj = new Date(sy, sm - 1, sd);
    const endDateObj = new Date(ey, em - 1, ed);
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        // const err = new Error("Spot couldn't be found");
        // err.status = 404;
        // err.title = "Spot couldn't be found";
        // return next(err);
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    } else if (req.user.id === spot.ownerId) {
        // const err = new Error('Spot belongs to current user');
        // err.status = 403;
        // err.title = 'Spot belongs to current user';
        // return next(err);
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    }

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

    const newBooking = await spot.createBooking({
        userId: req.user.id,
        startDate: startDateObj,
        endDate: endDateObj
    });

    res.json(newBooking);
});

// POST /api/spots/:spotId/reviews (create a review for a spot based on the spot's id)
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
    const { review, stars } = req.body;
    const spot = await Spot.findByPk(req.params.spotId);

    let existingReview = await spot.getReviews({
        where: { userId: req.user.id }
    });

    if (existingReview.length) {
        const err = new Error('User already has a review for this spot');
        err.status = 403;
        return next(err);
    }

    if (!spot) {
        // const err = new Error("Spot couldn't be found");
        // err.status = 404;
        // err.title = "Spot couldn't be found";
        // return next(err);
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    const newReview = await spot.createReview({
        userId: req.user.id,
        review, stars
    });

    res.status(201).json(newReview);
});

// POST /api/spots (create a spot)
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const owner = await User.findByPk(req.user.id);
    const newSpot = await owner.createSpot({
        address, city, state, country, lat, lng, name, description, price
    });

    res.status(201).json(newSpot);
});

// GET /api/spots/current (get all spots owned by the current user)
router.get('/current', requireAuth, async (req, res, next) => {
    const allSpots = await Spot.findAll({
        where: { ownerId: req.user.id },
        include: [
            {
                model: Review,
                attributes: ['id', 'stars']
            },
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            }
        ]
    });

    for (let i = 0; i < allSpots.length; i++) {
        const spot = allSpots[i];
        const allStars = [];
        const allPreviewImages = [];
        spot.Reviews.forEach(review => {
            allStars.push(review.stars);
        });
        spot.SpotImages.forEach(image => {
            if (image.preview) allPreviewImages.push(image.url);
        });
        spot.dataValues.avgRating = allStars.length ? allStars.reduce((accum, currentVal) => accum + currentVal) / allStars.length : 0;
        spot.dataValues.previewImage = allPreviewImages;
        delete spot.dataValues.Reviews;
        delete spot.dataValues.SpotImages;
    }

    res.json({
        Spots: allSpots
    });
});

// GET /api/spots/:spotId/bookings (get all bookings for a spot based on the spot's id)
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        // const err = new Error("Spot couldn't be found");
        // err.status = 404;
        // err.title = "Spot couldn't be found";
        // return next(err);
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    let allBookings;
    if (req.user.id === spot.ownerId) {
        allBookings = await spot.getBookings({
            include: {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        });
    } else {
        allBookings = await spot.getBookings({
            attributes: ['spotId', 'startDate', 'endDate']
        });
    }

    res.json({
        Bookings: allBookings
    });
});

// GET /api/spots/:spotId/reviews (get all reviews by a spot's id)
router.get('/:spotId/reviews', async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        // const err = new Error("Spot couldn't be found");
        // err.status = 404;
        // err.title = "Spot couldn't be found";
        // return next(err);
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    const allReviews = await spot.getReviews({
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    res.json({
        Reviews: allReviews
    });
});

// GET /api/spots/:spotId (get details of a spot from an id)
router.get('/:spotId', async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview'],
            },
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    });

    if (!spot) {
        // const err = new Error("Spot couldn't be found");
        // err.status = 404;
        // err.title = "Spot couldn't be found";
        // return next(err);
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    const spotReviews = await spot.getReviews();
    const allStars = [];
    spotReviews.forEach(review => {
        allStars.push(review.stars);
    });
    spot.dataValues.avgStarRating = allStars.length ? allStars.reduce((accum, currentVal) => accum + currentVal) / allStars.length : 0;
    spot.dataValues.numReviews = allStars.length;

    res.json(spot);
});

// GET /api/spots (get all spots)
router.get('/', validateQueryFilter, async (req, res, next) => {
    let query = {
        where: {}
    };

    const page = (req.query.page === undefined || req.query.page < 1 || req.query.page > 10) ? 1 : parseInt(req.query.page);
    const size = (req.query.size === undefined || req.query.size < 1 || req.query.size > 20) ? 20 : parseInt(req.query.size);

    if (page >= 1 && size >= 1) {
        query.limit = size;
        query.offset = size * (page - 1);
    }

    if (req.query.minLat && req.query.maxLat) {
        query.where.lat = { [Op.between]: [req.query.minLat, req.query.maxLat] };
    } else if (req.query.minLat) {
        query.where.lat = { [Op.gte]: req.query.minLat };
    } else if (req.query.maxLat) {
        query.where.lat = { [Op.lte]: req.query.maxLat };
    }

    if (req.query.minLng && req.query.maxLng) {
        query.where.lng = { [Op.between]: [req.query.minLng, req.query.maxLng] };
    } else if (req.query.minLng) {
        query.where.lng = { [Op.gte]: req.query.minLng };
    } else if (req.query.maxLng) {
        query.where.lng = { [Op.lte]: req.query.maxLng };
    }

    if (req.query.minPrice && req.query.maxPrice) {
        query.where.price = { [Op.between]: [req.query.minPrice, req.query.maxPrice] };
    } else if (req.query.minPrice) {
        query.where.price = { [Op.gte]: req.query.minPrice };
    } else if (req.query.maxPrice) {
        query.where.price = { [Op.lte]: req.query.maxPrice };
    }

    const allSpots = await Spot.findAll({
        include: [
            {
                model: Review,
                attributes: ['id', 'stars']
            },
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            }
        ],
        ...query
    });

    for (let i = 0; i < allSpots.length; i++) {
        const spot = allSpots[i];
        const allStars = [];
        const allPreviewImages = [];
        spot.Reviews.forEach(review => {
            allStars.push(review.stars);
        });
        spot.SpotImages.forEach(image => {
            if (image.preview) allPreviewImages.push(image.url);
        });
        spot.dataValues.avgRating = allStars.length ? allStars.reduce((accum, currentVal) => accum + currentVal) / allStars.length : 0;
        spot.dataValues.previewImage = allPreviewImages;
        delete spot.dataValues.Reviews;
        delete spot.dataValues.SpotImages;
    }

    res.json({
        Spots: allSpots,
        page,
        size
    });
});

// GET /api/spots (check if associated data appears)
// router.get('/', async (req, res, next) => {
//     const allSpots = await Spot.findAll({ include: { all: true } });
//     res.json(allSpots);
// });

module.exports = router;
