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
        spotId: 1,
        url: 'https://i.ibb.co/9cj25Kr/man-cave-alt3.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://i.ibb.co/F75n9vP/man-cave-alt4.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://i.ibb.co/rMsBNRB/cabin-preview.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://i.ibb.co/YWptzLf/cabin-alt1.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://i.ibb.co/DPBGDJQ/cabin-alt2.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://i.ibb.co/Kj1hRNb/cabin-alt3.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://i.ibb.co/72jm3kx/cabin-alt4.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://i.ibb.co/3cTx57s/mansion-preview.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://i.ibb.co/prp0ZHF/mansion-alt1.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://i.ibb.co/7r1w7PW/mansion-alt2.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://i.ibb.co/6rvTvv9/mansion-alt3.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://i.ibb.co/tzHkWG5/mansion-alt4.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://i.ibb.co/ZGfwf7m/townhome-preview.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://i.ibb.co/rFrbR2G/townhome-alt1.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://i.ibb.co/gWMGDJ9/townhome-alt2.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://i.ibb.co/3FGcktB/townhome-alt3.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://i.ibb.co/3vBSqQf/townhome-alt4.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://i.ibb.co/jJNnxpZ/bungalow-preview.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://i.ibb.co/pWhJ41f/bungalow-alt1.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://i.ibb.co/f8bf8sm/bungalow-alt2.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://i.ibb.co/kGVXF1P/bungalow-alt3.jpg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://i.ibb.co/6bMZsj8/bungalow-alt4.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://i.ibb.co/FWSLVRq/beach-preview.jpg',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://i.ibb.co/kqVKyLc/beach-alt1.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://i.ibb.co/XZzGFdD/beach-alt2.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://i.ibb.co/5vCJxZv/beach-alt3.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://i.ibb.co/zrrTCpH/beach-alt4.jpg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://i.ibb.co/C2s1KJV/rv-preview.jpg',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://i.ibb.co/fGtDs6Q/rv-alt1.jpg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://i.ibb.co/WHt0fX0/rv-alt2.jpg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://i.ibb.co/m6cBcwh/rv-alt3.jpg',
        preview: false
      },
      {
        spotId: 7,
        url: 'https://i.ibb.co/23qw4L1/rv-alt4.jpg',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://i.ibb.co/djNBRLT/winter-preview.jpg',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://i.ibb.co/8NRp2fz/winter-alt1.jpg',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://i.ibb.co/dMrvFhs/winter-alt2.jpg',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://i.ibb.co/CH5qRFF/winter-alt3.jpg',
        preview: false
      },
      {
        spotId: 8,
        url: 'https://i.ibb.co/Z16zL2q/winter-alt4.jpg',
        preview: false
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
    }, {});
  }
};
