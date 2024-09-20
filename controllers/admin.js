const Product = require("../models/Product");

exports.postAddProduct = (req, res) => {
  const { title, price, description, imageUrl } = req.body;

  return (
    req.user
      .createProduct({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
      })

      // return Product.create({
      //   title: title,
      //   price: price,
      //   description: description,
      //   imageUrl: imageUrl,
      //   UserId: req.user.dataValues.id,
      // })
      .then((result) => {
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
      })
  );
};
