const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  return Product.fetchAll()
    .then(([rows, fieldData]) => {
      return rows;
    })
    .catch((err) => {
      return err;
    });
};

exports.getProduct = (id) => {
  return Product.findById(id)
    .then(([rows, fieldData]) => {
      return rows;
    })
    .catch((err) => {
      return err;
    });
};
