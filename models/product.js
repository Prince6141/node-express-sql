const { DataTypes } = require("sequelize");
const sequelize = require("../Utils/database"); // Assuming you have configured Sequelize here

// Define the Product model
const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true, // Enable automatic creation of createdAt and updatedAt columns
  }
);

module.exports = Product;
