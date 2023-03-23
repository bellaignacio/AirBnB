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
        url: 'www.example.com/demo-crib.png',
        preview: true
      },
      {
        spotId: 1,
        url: 'www.example.com/alt-demo-crib.png',
        preview: false
      },
      {
        spotId: 2,
        url: 'www.example.com/one-mansion.png',
        preview: true
      },
      {
        spotId: 2,
        url: 'www.example.com/alt-one-mansion.png',
        preview: false
      },
      {
        spotId: 3,
        url: 'www.example.com/two-bungalow.png',
        preview: true
      },
      {
        spotId: 3,
        url: 'www.example.com/alt-two-bungalow.png',
        preview: false
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5, 6] },
    }, {});
  }
};
