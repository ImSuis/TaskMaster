const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432, // Default to 5432 if not set
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true, // Render requires SSL
        rejectUnauthorized: false // Allows self-signed certs
      }
    }
  }
);

module.exports = sequelize;