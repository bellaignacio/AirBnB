const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a street address.'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a city.'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a state.'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a country.'),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude is not valid.'),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude is not valid.'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters.'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a name.'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a description.'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a price per day.'),
    handleValidationErrors
];

// DELETE /api/spots/:spotId
router.delete('/:spotId', async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        err.title = "Spot couldn't be found";
        return next(err);
    } else if (req.user.id !== spot.ownerId) {
        const err = new Error('Spot does not belong to current user');
        err.status = 403;
        err.title = 'Spot does not belong to current user';
        return next(err);
    }

    await spot.destroy();

    res.status(200);
    res.json( {
        message: "Successfully deleted",
        statusCode: res.statusCode
    });
})

// PUT /api/spots/:spotId
router.put('/:spotId', validateSpot, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        err.title = "Spot couldn't be found";
        return next(err);
    } else if (req.user.id !== spot.ownerId) {
        const err = new Error('Spot does not belong to current user');
        err.status = 403;
        err.title = 'Spot does not belong to current user';
        return next(err);
    }

    spot.set({
        address, city, state, country, lat, lng, name, description, price
    });
    await spot.save();

    res.json(spot);
});

// POST /api/spots/:spotId/images
router.post('/:spotId/images', async (req, res, next) => {
    const { url, preview } = req.body;
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        err.title = "Spot couldn't be found";
        return next(err);
    } else if (req.user.id !== spot.ownerId) {
        const err = new Error('Spot does not belong to current user');
        err.status = 403;
        err.title = 'Spot does not belong to current user';
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

// POST /api/spots
router.post('/', validateSpot, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const owner = await User.findByPk(req.user.id);
    const newSpot = await owner.createSpot({
        address, city, state, country, lat, lng, name, description, price
    });

    res.status(201).json(newSpot);
});

// GET /api/spots/current (check if associated data appears)
router.get('/current', async (req, res, next) => {
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

    allSpots.forEach(async spot => {
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
    });

    res.json({
        Spots: allSpots
    });
});

// GET /api/spots/:spotId
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
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        err.title = "Spot couldn't be found";
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

// GET /api/spots (check if associated data appears)
// router.get('/', async (req, res, next) => {
//     const allSpots = await Spot.findAll({ include: { all: true } });
//     res.json(allSpots);
// });

// GET /api/spots
router.get('/', async (req, res, next) => {
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
        ]
    });

    allSpots.forEach(async spot => {
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
    });

    res.json({
        Spots: allSpots
    });
});

module.exports = router;
