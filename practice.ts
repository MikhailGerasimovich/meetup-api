import { SequelizeTypescriptMigration } from 'sequelize-typescript-migration-lts';
import { Sequelize } from 'sequelize-typescript';
import { join } from 'path';

import { Dialect } from 'sequelize';
import { Meetup } from 'src/core/meetup/meetup.model';
import { Tag } from 'src/core/tag/tag.model';
import { User } from 'src/core/user/user.model';
import { Role } from 'src/core/role/role.model';

import { config } from 'dotenv';
config();

const bootstrap = async () => {
  const sequelize: Sequelize = new Sequelize({
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT, 5432),
    dialect: process.env.DB_DIALECT as Dialect,
    models: [Meetup, Tag, User, Role],
    logging: false,
    define: {
      timestamps: false,
    },
  });
  try {
    const result = await SequelizeTypescriptMigration.makeMigration(sequelize, {
      outDir: join(__dirname, './db/migrations'),
      migrationName: 'init',
      useSnakeCase: false,
    });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

bootstrap();
