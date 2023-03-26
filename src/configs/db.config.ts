import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const dbconfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT) ?? 3000,
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? '957483',
  database: process.env.DB_NAME ?? 'meetup_db',
  models: [],
  autoLoadModels: true,
  define: {
    timestamps: false,
  },
};
