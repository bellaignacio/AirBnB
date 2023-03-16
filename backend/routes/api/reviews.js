const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review, User, Spot, SpotImage, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// validate review middleware
const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Please provide review text.'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5.'),
    handleValidationErrors
];

// DELETE /api/reviews/:reviewId (delete a review)
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);

    if (!review) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        err.title = "Review couldn't be found";
        return next(err);
    } else if (req.user.id !== review.userId) {
        const err = new Error('Review does not belong to current user');
        err.status = 403;
        err.title = 'Review does not belong to current user';
        return next(err);
    }

    await review.destroy();

    res.status(200);
    res.json( {
        message: "Successfully deleted",
        statusCode: res.statusCode
    });
});

// PUT /api/reviews/:reviewId (edit a review)
router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
    const { review, stars } = req.body;
    const editReview = await Review.findByPk(req.params.reviewId);

    if (!editReview) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        err.title = "Review couldn't be found";
        return next(err);
    } else if (req.user.id !== editReview.userId) {
        const err = new Error('Review does not belong to current user');
        err.status = 403;
        err.title = 'Review does not belong to current user';
        return next(err);
    }

    editReview.set({
        review, stars
    });
    await editReview.save();

    res.json(editReview);
});

// POST /api/reviews/:reviewId/images (add an image to a review based on the review's id)
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const { url } = req.body;
    const review = await Review.findByPk(req.params.reviewId);

    if (!review) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        err.title = "Review couldn't be found";
        return next(err);
    } else if (req.user.id !== review.userId) {
        const err = new Error('Review does not belong to current user');
        err.status = 403;
        err.title = 'Review does not belong to current user';
        return next(err);
    } else {
        const allReviewImages = await review.getReviewImages();
        if (allReviewImages.length >= 10) {
            const err = new Error('Maximum number of images for this resource was reached');
            err.status = 403;
            err.title = 'Maximum number of images for this resource was reached';
            return next(err);
        }
    }

    const newImage = await review.createReviewImage({
        url
    });

    res.json({
        id: newImage.id,
        url
    });
});

// GET /api/reviews/current (get all reviews of the current user)
router.get('/current', requireAuth, async (req, res, next) => {
    const allReviews = await Review.findAll({
        where: { userId: req.user.id },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {
                    exclude: ['description', 'createdAt', 'updatedAt'] // NEED TO ADD PREVIEW IMAGE
                }
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    for (let i = 0; i < allReviews.length; i++) {
        const review = allReviews[i];
        const spotImages = await review.Spot.getSpotImages();
        const allPreviewImages = [];
        spotImages.forEach(async image => {
            if (image.preview) allPreviewImages.push(image.url)
        });
        review.dataValues.Spot.dataValues.previewImage = allPreviewImages;
    }

    res.json({
        Reviews: allReviews
    });
});

// GET /api/reviews (check if associated data appears)
// router.get('/', async (req, res, next) => {
//     const allReviews = await Review.findAll({ include: { all: true } });
//     res.json(allReviews);
// });

module.exports = router;
