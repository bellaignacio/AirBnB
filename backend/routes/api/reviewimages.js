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

    res.status(200).json({
        message: "Successfully deleted",
        statusCode: res.statusCode
    });
});

module.exports = router;
