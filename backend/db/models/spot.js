'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    async getAvgRating() {
      const allReviews = await this.getReviews();
      const allStars = [];
      allReviews.forEach(review => {
        allStars.push(review.stars);
      });
      const avgRating = allStars.length ? allStars.reduce((accum, currentVal) => accum + currentVal) / allStars.length : 0;
      return avgRating;
    }
    async getNumReviews() {
      const allReviews = await this.getReviews();
      return allReviews.length;
    }
    async getPreviewImages() {
      const allSpotImages = await this.getSpotImages();
      const allPreviewImages = [];
      allSpotImages.forEach(image => {
        if (image.preview) allPreviewImages.push(image.url);
      });
      return allPreviewImages;
    }
    static associate(models) {
      Spot.belongsTo(models.User, { foreignKey: 'ownerId', as: 'Owner' });
      Spot.hasMany(models.Review, { foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true });
      Spot.hasMany(models.Booking, { foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true });
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true });
    }
  }
  Spot.init({
    ownerId: DataTypes.INTEGER,
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
      validate: { // [-90, 90]
        min: -90,
        max: 90
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      validate: { // [-180, 180]
        min: -180,
        max: 180
      }
    },
    name: {
      type: DataTypes.STRING(50),
      validate: {
        len: [0, 50]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
