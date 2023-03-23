const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { SpotImage } = require('../../db/models');

const router = express.Router();

// DELETE /api/spot-images/:imageId (delete a spot image)
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const image = await SpotImage.findByPk(req.params.imageId);

    if (!image) {
        const err = new Error("Spot Image couldn't be found");
        err.status = 404;
        return next(err);
    }

    const spot = await image.getSpot();

    if (req.user.id !== spot.ownerId) {
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
