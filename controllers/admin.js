const Product = require("../models/product");

exports.postAddProduct = async (req) => {
  const { title, price, description, imageUrl } = req.body;

  // Create a new instance of Product
  const product = new Product(null, title, imageUrl, description, price);

  try {
    // Await the save operation and return the result
    const result = await product.save();
    return result[0].affectedRows; // Return the affected rows to the caller
  } catch (error) {
    console.error(error);
    throw error; // Throw the error so the caller can handle it
  }
};
