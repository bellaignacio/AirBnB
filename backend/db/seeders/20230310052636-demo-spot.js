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
        description: "Man cave, bachelor pad of the ages, Pefect for a boy's night out",
        price: 234
      },
      {
        ownerId: 1,
        address: '101 Bear Lane',
        city: 'Big Bear',
        state: 'California',
        country: 'United States of America',
        lat: -23.3349875,
        lng: 100.2338492,
        name: "Demo's Lakeside Cabin",
        description: 'A woodsy getaway, perfect for dipping your toes in the lake',
        price: 592
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
        description: "The eighth wonder of the world, you've never seen a more beautiful house",
        price: 587
      },
      {
        ownerId: 2,
        address: '202 Destiny Road',
        city: 'Dallas',
        state: 'Texas',
        country: 'United States of America',
        lat: 34.2839283,
        lng: 1.1829384,
        name: "FakeUser1's Townhome",
        description: 'Budget-friendly place for a quick weekend or business trip',
        price: 103
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
        description: 'The hippest, most chic spot on the street, my bungalow',
        price: 122
      },
      {
        ownerId: 3,
        address: '303 Summer Cove',
        city: 'Miami',
        state: 'Florida',
        country: 'United States of America',
        lat: -1.8939999,
        lng: 123.1129384,
        name: "FakeUser2's Beach House",
        description: 'Feel the sun, sand, and breeze at this sanctuary near the shore',
        price: 1230
      },
      {
        ownerId: 4,
        address: '444 Dummy Avenue',
        city: 'Flagstaff',
        state: 'Arizona',
        country: 'United States of America',
        lat: -50.1119204,
        lng: 122.2937784,
        name: "FakeUser4's RV Camping Ground",
        description: 'The perfect spot to bring your RV or pitch a tent',
        price: 59
      },
      {
        ownerId: 4,
        address: '404 Snowy Boulevard',
        city: 'Brighton',
        state: 'Utah',
        country: 'United States of America',
        lat: 45.2283949,
        lng: 19.1882930,
        name: "FakeUser4's Winter Paradise",
        description: 'After snowboarding or skiing, relax in your own private hot tub',
        price: 431
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8] },
      // name: { [Op.in]: ["Demo's Crib", "FakeUser1's Mansion", "FakeUser2's Bungalow"] },
    }, {});
  }
};
