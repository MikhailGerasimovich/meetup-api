'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('roles', [
      {
        id: '1d40f052-8231-4414-ad10-389655761315',
        name: 'ADMIN',
      },
      {
        id: 'aa52124e-bbf5-7324-be3c-9cf0bf8f67f1',
        name: 'USER',
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', null, {});
  },
};
