'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 2,
        review: 'This mansion was the worst ever! So expensive..',
        stars: 1
      },
      {
        userId: 2,
        spotId: 3,
        review: 'Biggest (bungalow) bang for your buck, so worth it',
        stars: 5
      },
      {
        userId: 3,
        spotId: 1,
        review: 'Expensive townhome, but it was fun for the boys',
        stars: 3
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] },
      // review: { [Op.in]: ['This mansion was the worst ever! So expensive..', 'Biggest (bungalow) bang for your buck, so worth it', 'Expensive townhome, but it was fun for the boys'] },
    }, {});
  }
};
