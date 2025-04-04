const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize =
  process.env.NODE_ENV === "test"
    ? new Sequelize("sqlite::memory:", { logging: false }) 
    : new Sequelize({
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false, 
      });

module.exports = sequelize;
