const { DataTypes } = require("sequelize");
const sequelize = require("../Utils/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100], // Optional: Ensure name is between 2 and 100 characters
      },
    },
    email: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileImage: {
      type: DataTypes.STRING, // To store the image path or URL as a string
      allowNull: true, // Optional field (can be NULL)
    },
  },
  {
    timestamps: true, // Enable automatic creation of createdAt and updatedAt columns
  }
);

module.exports = User;
