const Product = require("../models/product");

// Function to get all products
exports.getProducts = () => {
  return Product.findAll() // Fetch all products
    .then((products) => products)
    .catch((error) => {
      throw error; // Rethrow error to be handled by route
    });
};

// Function to get a single product by ID
exports.getProduct = (id) => {
  return Product.findByPk(id) // Find a product by primary key (ID)
    .then((product) => product)
    .catch((error) => {
      throw error; // Rethrow error to be handled by route
    });
};

// Function to delete a product by ID
exports.deleteProduct = (id) => {
  return Product.destroy({ where: { id: id } }) // Deletes product by ID
    .then((deletedCount) => {
      console.log(deletedCount);
      if (deletedCount != 1) {
        throw new Error("Product not found"); // If no product is deleted
      }
      return { message: "Product deleted successfully" }; // Success response
    })
    .catch((error) => {
      throw error; // Rethrow error to be handled by route
    });
};

// Function to update a product by ID
exports.updateProduct = (id, updateData) => {
  return Product.update(updateData, { where: { id: id } })
    .then((updatedCount) => {
      if (updatedCount[0] === 0) {
        throw new Error("Product not found"); // No product was updated
      }
      return { message: "Product updated successfully" }; // Success message
    })
    .catch((error) => {
      throw error; // Rethrow error to be handled by route
    });
};
