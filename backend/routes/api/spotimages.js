const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
        // const err = new Error('Spot does not belong to current user');
        // err.status = 403;
        // err.title = 'Spot does not belong to current user';
        // return next(err);
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

// GET /api/spot-images (check if associated data appears)
// router.get('/', async (req, res, next) => {
//     const allSpotImages = await SpotImage.findAll({ include: { all: true } });
//     res.json(allSpotImages);
// });

module.exports = router;
