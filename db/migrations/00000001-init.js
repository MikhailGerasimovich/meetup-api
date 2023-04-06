'use strict';

const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "tags", deps: []
 * createTable "users", deps: []
 * createTable "roles", deps: []
 * createTable "meetups", deps: [users]
 * createTable "meetups_tags", deps: [meetups, tags]
 * createTable "meetups_users", deps: [meetups, users]
 * createTable "users_roles", deps: [users, roles]
 *
 **/

const info = {
    "revision": 1,
    "name": "init",
    "created": "2023-04-03T10:53:43.289Z",
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
                state: '{"revision":1,"tables":{"meetups":{"tableName":"meetups","schema":{"id":{"seqType":"Sequelize.UUID","unique":true,"primaryKey":true},"title":{"seqType":"Sequelize.STRING","allowNull":false},"description":{"seqType":"Sequelize.STRING","allowNull":false},"date":{"seqType":"Sequelize.DATE","allowNull":false},"place":{"seqType":"Sequelize.STRING","allowNull":false},"organizer_id":{"seqType":"Sequelize.UUID","allowNull":true,"references":{"model":"users","key":"id"},"onUpdate":"CASCADE","onDelete":"SET NULL"}},"indexes":{}},"tags":{"tableName":"tags","schema":{"id":{"seqType":"Sequelize.UUID","unique":true,"primaryKey":true},"name":{"seqType":"Sequelize.STRING","allowNull":false}},"indexes":{}},"users":{"tableName":"users","schema":{"id":{"seqType":"Sequelize.UUID","unique":true,"primaryKey":true},"login":{"seqType":"Sequelize.STRING","allowNull":false,"unique":true},"password":{"seqType":"Sequelize.STRING","allowNull":false},"email":{"seqType":"Sequelize.STRING","allowNull":false,"unique":true}},"indexes":{}},"roles":{"tableName":"roles","schema":{"id":{"seqType":"Sequelize.UUID","unique":true,"primaryKey":true},"name":{"seqType":"Sequelize.STRING","allowNull":false,"unique":true}},"indexes":{}},"meetups_tags":{"tableName":"meetups_tags","schema":{"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"meetup_id":{"seqType":"Sequelize.UUID","primaryKey":true,"references":{"model":"meetups","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"tag_id":{"seqType":"Sequelize.UUID","primaryKey":true,"references":{"model":"tags","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"}},"indexes":{}},"meetups_users":{"tableName":"meetups_users","schema":{"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"meetup_id":{"seqType":"Sequelize.UUID","primaryKey":true,"references":{"model":"meetups","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"user_id":{"seqType":"Sequelize.UUID","primaryKey":true,"references":{"model":"users","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"}},"indexes":{}},"users_roles":{"tableName":"users_roles","schema":{"createdAt":{"seqType":"Sequelize.DATE","allowNull":false},"updatedAt":{"seqType":"Sequelize.DATE","allowNull":false},"user_id":{"seqType":"Sequelize.UUID","primaryKey":true,"references":{"model":"users","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"},"role_id":{"seqType":"Sequelize.UUID","primaryKey":true,"references":{"model":"roles","key":"id"},"onUpdate":"CASCADE","onDelete":"CASCADE"}},"indexes":{}}}}'
            }],
            {}
        ]
    },




    {
        fn: "createTable",
        params: [
            "tags",
            {
                "id": {
                    "primaryKey": true,
                    "unique": true,
                    "type": Sequelize.UUID
                },
                "name": {
                    "allowNull": false,
                    "type": Sequelize.STRING
                }
            },
            {}
        ]
    },

    {
        fn: "createTable",
        params: [
            "users",
            {
                "id": {
                    "primaryKey": true,
                    "unique": true,
                    "type": Sequelize.UUID
                },
                "login": {
                    "unique": true,
                    "allowNull": false,
                    "type": Sequelize.STRING
                },
                "password": {
                    "allowNull": false,
                    "type": Sequelize.STRING
                },
                "email": {
                    "unique": true,
                    "allowNull": false,
                    "type": Sequelize.STRING
                }
            },
            {}
        ]
    },

    {
        fn: "createTable",
        params: [
            "roles",
            {
                "id": {
                    "primaryKey": true,
                    "unique": true,
                    "type": Sequelize.UUID
                },
                "name": {
                    "unique": true,
                    "allowNull": false,
                    "type": Sequelize.STRING
                }
            },
            {}
        ]
    },

    {
        fn: "createTable",
        params: [
            "meetups",
            {
                "id": {
                    "primaryKey": true,
                    "unique": true,
                    "type": Sequelize.UUID
                },
                "title": {
                    "allowNull": false,
                    "type": Sequelize.STRING
                },
                "description": {
                    "allowNull": false,
                    "type": Sequelize.STRING
                },
                "date": {
                    "allowNull": false,
                    "type": Sequelize.DATE
                },
                "place": {
                    "allowNull": false,
                    "type": Sequelize.STRING
                },
                "organizer_id": {
                    "onDelete": "SET NULL",
                    "onUpdate": "CASCADE",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true,
                    "type": Sequelize.UUID
                }
            },
            {}
        ]
    },

    {
        fn: "createTable",
        params: [
            "meetups_tags",
            {
                "createdAt": {
                    "allowNull": false,
                    "type": Sequelize.DATE
                },
                "updatedAt": {
                    "allowNull": false,
                    "type": Sequelize.DATE
                },
                "meetup_id": {
                    "onDelete": "CASCADE",
                    "onUpdate": "CASCADE",
                    "references": {
                        "model": "meetups",
                        "key": "id"
                    },
                    "primaryKey": true,
                    "type": Sequelize.UUID
                },
                "tag_id": {
                    "onDelete": "CASCADE",
                    "onUpdate": "CASCADE",
                    "references": {
                        "model": "tags",
                        "key": "id"
                    },
                    "primaryKey": true,
                    "type": Sequelize.UUID
                }
            },
            {}
        ]
    },

    {
        fn: "createTable",
        params: [
            "meetups_users",
            {
                "createdAt": {
                    "allowNull": false,
                    "type": Sequelize.DATE
                },
                "updatedAt": {
                    "allowNull": false,
                    "type": Sequelize.DATE
                },
                "meetup_id": {
                    "onDelete": "CASCADE",
                    "onUpdate": "CASCADE",
                    "references": {
                        "model": "meetups",
                        "key": "id"
                    },
                    "primaryKey": true,
                    "type": Sequelize.UUID
                },
                "user_id": {
                    "onDelete": "CASCADE",
                    "onUpdate": "CASCADE",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "primaryKey": true,
                    "type": Sequelize.UUID
                }
            },
            {}
        ]
    },

    {
        fn: "createTable",
        params: [
            "users_roles",
            {
                "createdAt": {
                    "allowNull": false,
                    "type": Sequelize.DATE
                },
                "updatedAt": {
                    "allowNull": false,
                    "type": Sequelize.DATE
                },
                "user_id": {
                    "onDelete": "CASCADE",
                    "onUpdate": "CASCADE",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "primaryKey": true,
                    "type": Sequelize.UUID
                },
                "role_id": {
                    "onDelete": "CASCADE",
                    "onUpdate": "CASCADE",
                    "references": {
                        "model": "roles",
                        "key": "id"
                    },
                    "primaryKey": true,
                    "type": Sequelize.UUID
                }
            },
            {}
        ]
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
        fn: "dropTable",
        params: ["meetups"]
    },
    {
        fn: "dropTable",
        params: ["meetups_tags"]
    },
    {
        fn: "dropTable",
        params: ["meetups_users"]
    },
    {
        fn: "dropTable",
        params: ["users_roles"]
    },
    {
        fn: "dropTable",
        params: ["tags"]
    },
    {
        fn: "dropTable",
        params: ["users"]
    },
    {
        fn: "dropTable",
        params: ["roles"]
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
