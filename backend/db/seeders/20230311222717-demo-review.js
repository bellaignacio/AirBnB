'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 3,
        review: 'This mansion was the worst ever! So expensive..',
        stars: 1
      },
      {
        userId: 3,
        spotId: 3,
        review: 'Whatever experience, could be better',
        stars: 2
      },
      {
        userId: 2,
        spotId: 5,
        review: 'Biggest (bungalow) bang for your buck, so worth it',
        stars: 5
      },
      {
        userId: 1,
        spotId: 5,
        review: 'Almost better than my own place!',
        stars: 4
      },
      {
        userId: 3,
        spotId: 1,
        review: 'Expensive townhome, but it was fun for the boys',
        stars: 3
      },
      {
        userId: 2,
        spotId: 1,
        review: 'Cool place, perfect spot',
        stars: 4
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5, 6] },
      // review: { [Op.in]: ['This mansion was the worst ever! So expensive..', 'Biggest (bungalow) bang for your buck, so worth it', 'Expensive townhome, but it was fun for the boys'] },
    }, {});
  }
};
