'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users_roles', [
      {
        user_id: '461fbe94-b182-4f89-9de0-baaf95fc0684',
        role_id: '1d40f052-8231-4414-ad10-389655761315',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: '1d40f052-8231-4414-ad10-389655761315',
        role_id: 'aa52124e-bbf5-7324-be3c-9cf0bf8f67f1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users_roles', null, {});
  },
};
