'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "updatedAt" from table "meetups_tags"
 * removeColumn "createdAt" from table "meetups_tags"
 * removeColumn "updatedAt" from table "meetups_users"
 * removeColumn "createdAt" from table "meetups_users"
 * removeColumn "updatedAt" from table "users_roles"
 * removeColumn "createdAt" from table "users_roles"
 *
 **/

const info = {
    "revision": 2,
    "name": "init",
    "created": "2023-04-07T07:13:15.820Z",
    "comment": ""
};

const migrationCommands = [

    {
        fn: "createTable",
        params: [
            "SequelizeMigrationsMeta",
            {
                "revision": {
                    "primaryKey": true,
                    "type": Sequelize.INTEGER
                },
                "name": {
                    "allowNull": false,
                    "type": Sequelize.STRING
                },
                "state": {
                    "allowNull": false,
                    "type": Sequelize.JSON
                },
            },
            {}
        ]
    },
    {
        fn: "bulkDelete",
        params: [
            "SequelizeMigrationsMeta",
            [{
                revision: info.revision
            }],
            {}
        ]
    },
    {
        fn: "bulkInsert",
        params: [
            "SequelizeMigrationsMeta",
            [{
                revision: info.revision,
                name: info.name,
                state: '{"revision":2,"tables":{"meetups":{"tableName":"meetups","schema":{"id":{"seqType":"Sequelize.UUID","unique":true,"primaryKey":true},"title":{"seqType":"Sequelize.STRING","allowNull":false},"description":{"seqType":"Sequelize.STRING","allowNull":false},"date":{"seqType":"Sequelize.DATE","allowNull":false},"place":{"seqType":"Sequelize.STRING","allowNull":false},"organizer_id":{"seqType":"Sequelize.UUID","allowNull":true,"references":{"model":"users","key":"id"},"onUpdate":"CASCADE","onDelete":"SET NULL"}},"indexes":{}},"tags":{"tableName":"tags","schema":{"id":{"seqType":"Sequelize.UUID","unique":true,"primaryKey":true},"name":{"seqType":"Sequelize.STRING","allowNull":false}},"indexes":{}},"users":{"tableName":"users","schema":{"id":{"seqType":"Sequelize.UUID","unique":true,"primaryKey":true},"login":{"seqType":"Sequelize.STRING","allowNull":false,"unique":true},"password":{"seqType":"Sequelize.STRING","allowNull":false},"email":{"seqType":"Sequelize.STRING","allowNull":false,"unique":true}},"indexes":{}},"roles":{"tableName":"roles","schema":{"id":{"seqType":"Sequelize.UUID","unique":true,"primaryKey":true},"name":{"seqType":"Sequelize.STRING","allowNull":false,"unique":true}},"indexes":{}},"meetups_tags":{"tableName":"meetups_tags","schema":{"meetup_id":{"seqType":"Sequelize.UUID","primaryKey":true,"references":{"model":"meetups","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"tag_id":{"seqType":"Sequelize.UUID","primaryKey":true,"references":{"model":"tags","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"}},"indexes":{}},"meetups_users":{"tableName":"meetups_users","schema":{"meetup_id":{"seqType":"Sequelize.UUID","primaryKey":true,"references":{"model":"meetups","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"user_id":{"seqType":"Sequelize.UUID","primaryKey":true,"references":{"model":"users","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"}},"indexes":{}},"users_roles":{"tableName":"users_roles","schema":{"user_id":{"seqType":"Sequelize.UUID","primaryKey":true,"references":{"model":"users","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"role_id":{"seqType":"Sequelize.UUID","primaryKey":true,"references":{"model":"roles","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"}},"indexes":{}}}}'
            }],
            {}
        ]
    },



    {
        fn: "removeColumn",
        params: ["meetups_tags", "updatedAt"]
    },
    {
        fn: "removeColumn",
        params: ["meetups_tags", "createdAt"]
    },
    {
        fn: "removeColumn",
        params: ["meetups_users", "updatedAt"]
    },
    {
        fn: "removeColumn",
        params: ["meetups_users", "createdAt"]
    },
    {
        fn: "removeColumn",
        params: ["users_roles", "updatedAt"]
    },
    {
        fn: "removeColumn",
        params: ["users_roles", "createdAt"]
    }
];

const rollbackCommands = [

    {
        fn: "bulkDelete",
        params: [
            "SequelizeMigrationsMeta",
            [{
                revision: info.revision,
            }],
            {}
        ]
    },



    {
        fn: "addColumn",
        params: [
            "meetups_tags",
            "updatedAt",
            {
                "allowNull": false,
                "type": Sequelize.DATE
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "meetups_tags",
            "createdAt",
            {
                "allowNull": false,
                "type": Sequelize.DATE
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "meetups_users",
            "updatedAt",
            {
                "allowNull": false,
                "type": Sequelize.DATE
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "meetups_users",
            "createdAt",
            {
                "allowNull": false,
                "type": Sequelize.DATE
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "users_roles",
            "updatedAt",
            {
                "allowNull": false,
                "type": Sequelize.DATE
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "users_roles",
            "createdAt",
            {
                "allowNull": false,
                "type": Sequelize.DATE
            }
        ]
    }
];

module.exports = {
  pos: 0,
  up: function(queryInterface, Sequelize) {
    let index = this.pos;

    return new Promise(function(resolve, reject) {
      function next() {
        if (index < migrationCommands.length) {
          let command = migrationCommands[index];
          console.log("[#"+index+"] execute: " + command.fn);
          index++;
          queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
        } else resolve();
      }

      next();
    });
  },
  down: function(queryInterface, Sequelize) {
    let index = this.pos;

    return new Promise(function(resolve, reject) {
      function next() {
        if (index < rollbackCommands.length) {
          let command = rollbackCommands[index];
          console.log("[#"+index+"] execute: " + command.fn);
          index++;
          queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
        }
        else resolve();
      }

      next();
    });
  },
  info
};
