const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Review, User, Spot, ReviewImage } = require('../../db/models');
const { validateReview } = require('../../utils/validation');

const router = express.Router();

// DELETE /api/reviews/:reviewId (delete a review)
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);

    if (!review) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        return next(err);
    }

    if (req.user.id !== review.userId) {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    }

    await review.destroy();

    res.status(200).json({
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
        return next(err);
    }

    if (req.user.id !== editReview.userId) {
        const err = new Error('Forbidden');
        err.status = 403;
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
        return next(err);
    }

    if (req.user.id !== review.userId) {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    }

    const allReviewImages = await review.getReviewImages();

    if (allReviewImages.length >= 10) {
        const err = new Error('Maximum number of images for this resource was reached');
        err.status = 403;
        return next(err);
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
    const currentUser = await User.getCurrentUserById(req.user.id);
    const allReviews = await currentUser.getReviews({
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {
                    exclude: ['description', 'createdAt', 'updatedAt']
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
        const spot = await review.getSpot();
        review.dataValues.Spot.dataValues.previewImage = await spot.getPreviewImages();
    }

    res.json({
        Reviews: allReviews
    });
});

module.exports = router;
