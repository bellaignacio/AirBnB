const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { ReviewImage } = require('../../db/models');

const router = express.Router();

// DELETE /api/review-images/:imageId (delete a review image)
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const image = await ReviewImage.findByPk(req.params.imageId);

    if (!image) {
        const err = new Error("Review Image couldn't be found");
        err.status = 404;
        return next(err);
    }

    const review = await image.getReview();

    if (req.user.id !== review.userId) {
        const err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    }

    await image.destroy();

    res.status(200);
    res.json({
        message: "Successfully deleted",
        statusCode: res.statusCode
    });
});

// GET /api/review-images (check if associated data appears)
// router.get('/', async (req, res, next) => {
//     const allReviewImages = await ReviewImage.findAll({ include: { all: true } });
//     res.json(allReviewImages);
// });

module.exports = router;
