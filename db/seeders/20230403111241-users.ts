'use strict';
const uuid = require('uuid');

const adminId = uuid.v4();
const userId = uuid.v4();

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        id: '461fbe94-b182-4f89-9de0-baaf95fc0684',
        login: 'admin',
        email: 'admin@mail.ru',
        password: '$2b$10$47Osx4LR9oY0Tuw5Xa8BEORExmPn3L5P1Qk2LiXZSwqFVzj6QRXIy', //admin
      },
      {
        id: '1d40f052-8231-4414-ad10-389655761315',
        login: 'user',
        email: 'user@mail.ru',
        password: '$2b$10$9ODgqND9oPwQh.9VmqnAo.rdvKrGVcywyZMfWKeV1KL/aLOfH4QR6', //user
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
