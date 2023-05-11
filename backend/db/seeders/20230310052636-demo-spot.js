'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '111 Dummy Drive',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States of America',
        lat: 53.4892340,
        lng: -103.5892058,
        name: "Demo's Crib",
        description: 'Man cave, bachelor pad of the ages',
        price: 234
      },
      {
        ownerId: 2,
        address: '222 Dummy Street',
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America',
        lat: -83.2385938,
        lng: 4.1248275,
        name: "FakeUser1's Mansion",
        description: 'The eighth wonder of the world',
        price: 587
      },
      {
        ownerId: 3,
        address: '333 Dummy Circle',
        city: 'San Diego',
        state: 'California',
        country: 'United States of America',
        lat: 49.1839583,
        lng: 133.2839500,
        name: "FakeUser2's Bungalow",
        description: 'The hippest, most chic spot on the street',
        price: 122
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] },
      // name: { [Op.in]: ["Demo's Crib", "FakeUser1's Mansion", "FakeUser2's Bungalow"] },
    }, {});
  }
};
