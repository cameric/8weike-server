module.exports = {
  mysql: {
    database: process.env.MYSQL_ENV_MYSQL_DATABASE,
    host: process.env.MYSQL_PORT_3306_TCP_ADDR,
    password: process.env.MYSQL_ENV_MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT_3306_TCP_PORT,
    user: process.env.MYSQL_ENV_MYSQL_USER,
  },
};
