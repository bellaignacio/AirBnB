'use strict';
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: 'FirstDemo',
        lastName: 'LastDemo',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('passwordDemo')
      },
      {
        firstName: 'FirstOne',
        lastName: 'LastOne',
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        firstName: 'FirstTwo',
        lastName: 'LastTwo',
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password2')
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] },
      // username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] },
      // email: { [Op.in]: ['demo@user.io', 'user1@user.io', 'user2@user.io'] },
    }, {});
  }
};
