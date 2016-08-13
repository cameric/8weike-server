module.exports = {
  mysql: {
    database: process.env.MYSQL_RDS_DB_PROD_NAME,
    host: process.env.MYSQL_RDS_DB_PROD_HOST,
    password: process.env.MYSQL_RDS_DB_PROD_PASSWORD,
    port: process.env.MYSQL_RDS_DB_PROD_PORT,
    user: process.env.MYSQL_RDS_DB_PROD_USER,
    ssl: 'Amazon RDS',
  },
};