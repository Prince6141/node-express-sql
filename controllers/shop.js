const Product = require("../models/Product");

// Function to get all products
exports.getProducts = (req) => {
  return (
    req.user
      .getProducts()
      // return Product.findAll() // Fetch all products
      .then((products) => products)
      .catch((error) => {
        throw error; // Rethrow error to be handled by route
      })
  );
};

// Function to get a single product by ID
exports.getProduct = (req, prodId) => {
  return (
    req.user
      .getProducts({ where: { id: prodId } })
      // return Product.findByPk(id) // Find a product by primary key (ID)
      .then((product) => product)
      .catch((error) => {
        throw error; // Rethrow error to be handled by route
      })
  );
};

// Function to delete a product by ID
exports.deleteProduct = (id) => {
  return Product.destroy({ where: { id: id } }) // Deletes product by ID
    .then((deletedCount) => {
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

exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then((cart) => {
      if (!cart) {
        // Create cart if it doesn't exist
        return req.user.createCart();
      }
      return cart; // Return the existing cart
    })
    .then((cart) => {
      return cart.getProducts(); // Get products from the cart
    })
    .then((products) => {
      console.log("Products in cart:", products);
      res.status(201).json({ products });
    })
    .catch((err) => {
      console.error("Error retrieving or creating the cart:", err);
      res.status(500).send("Error retrieving cart"); // Handle error response
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      if (!cart) {
        return req.user.createCart();
      }
      return cart;
    })
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
        newQuantity = product.CartItem.quantity + 1; // Increment quantity if product exists
      }

      return Product.findByPk(prodId).then((product) => {
        if (!product) {
          throw new Error("Product not found");
        }
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity },
        });
      });
    })
    .then(() => {
      res.status(201).json({ message: "Product successfully added to cart" });
    })
    .catch((err) => {
      console.error("Error adding product to cart:", err);
      res.status(500).send(err);
    });
};
