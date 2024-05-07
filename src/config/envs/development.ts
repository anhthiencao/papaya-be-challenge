export const config = {
  db: {
    type: process.env.DB_TYPE || 'mysql',
    synchronize: false,
    logging: true,
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || 'username',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'dbname',
    extra: {
      connectionLimit: 10,
    },
    autoLoadEntities: true,
  },
  models: {
    category: process.env.DB_TABLE_CATEGORY || 'category',
    publisher: process.env.DB_TABLE_PUBLISHER || 'publisher',
    news: process.env.DB_TABLE_NEWS || 'news',
  },
  foo: 'dev-bar',
};
