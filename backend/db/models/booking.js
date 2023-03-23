const moment = require('moment');

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, { foreignKey: 'userId' });
      Booking.belongsTo(models.Spot, { foreignKey: 'spotId' });
    }
  }
  Booking.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: DataTypes.INTEGER,
    spotId: DataTypes.INTEGER,
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      get: function () {
        return moment.utc(this.getDataValue('startDate')).format('YYYY-MM-DD');
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        afterStartDate(value) {
          if (new Date(value).getTime() <= new Date(this.startDate).getTime()) {
            throw new Error('endDate cannot be on or before startDate')
          }
        }
      },
      get: function () {
        return moment.utc(this.getDataValue('endDate')).format('YYYY-MM-DD');
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
