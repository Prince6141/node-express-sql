const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load environment variables from a .env file

// Create a new instance of Sequelize for MySQL connection
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    dialect: "mysql", // Specify the database dialect (MySQL in this case)
    host: process.env.MYSQL_HOST, // Database host
    logging: false, // Disable logging for cleaner output (optional)
  }
);

// Function to check if the connection to the database was successful
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
