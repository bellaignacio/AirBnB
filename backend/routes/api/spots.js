const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// POST /api/spots
router.post('/', async (req, res, next) => {});

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
                attributes: ['id', 'url'],
                where: { preview: true }
            }
        ]
    });

    allSpots.forEach(async spot => {
        const allStars = [];
        const allPreviewImages = [];
        spot.Reviews.forEach(review => {
            allStars.push(review.stars);
        })
        spot.SpotImages.forEach(image => {
            allPreviewImages.push(image.url);
        })
        spot.dataValues.avgRating = allStars.reduce((accum, currentVal) => accum + currentVal) / allStars.length;
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
    spot.dataValues.avgStarRating = allStars.reduce((accum, currentVal) => accum + currentVal) / allStars.length;
    spot.dataValues.numReviews = allStars.length;

    res.json(spot);
});

// GET /api/spots (check if associated data appears)
router.get('/', async (req, res, next) => {
    const allSpots = await Spot.findAll({
        include: [
            {
                model: Review,
                attributes: ['id', 'stars']
            },
            {
                model: SpotImage,
                attributes: ['id', 'url'],
                where: { preview: true }
            }
        ]
    });

    allSpots.forEach(async spot => {
        const allStars = [];
        const allPreviewImages = [];
        spot.Reviews.forEach(review => {
            allStars.push(review.stars);
        })
        spot.SpotImages.forEach(image => {
            allPreviewImages.push(image.url);
        })
        spot.dataValues.avgRating = allStars.reduce((accum, currentVal) => accum + currentVal) / allStars.length;
        spot.dataValues.previewImage = allPreviewImages;
        delete spot.dataValues.Reviews;
        delete spot.dataValues.SpotImages;
    });

    res.json({
        Spots: allSpots
    });
});

module.exports = router;
