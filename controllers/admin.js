const Product = require("../models/product");

exports.postAddProduct = (req, res) => {
  const { title, price, description, imageUrl } = req.body;

  return Product.create({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
  })
    .then((result) => {
      console.log(result.dataValues);
      return {
        message: "Product added successfully!",
        product: result.dataValues,
      };
    })
    .catch((error) => {
      console.error("Error adding product:", error);
      return {
        message: "Failed to add product",
        error: error.message, // Include error message for debugging
      };
    });
};
