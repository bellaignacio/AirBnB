'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://i.ibb.co/kQmQYjh/man-cave-preview.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://i.ibb.co/1mVBSf4/man-cave-alt1.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://i.ibb.co/Bj6nTj6/man-cave-alt2.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://i.ibb.co/3cTx57s/mansion-preview.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://i.ibb.co/prp0ZHF/mansion-alt1.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://i.ibb.co/7r1w7PW/mansion-alt2.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://i.ibb.co/jJNnxpZ/bungalow-preview.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://i.ibb.co/pWhJ41f/bungalow-alt1.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://i.ibb.co/f8bf8sm/bungalow-alt2.jpg',
        preview: false
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
    }, {});
  }
};
