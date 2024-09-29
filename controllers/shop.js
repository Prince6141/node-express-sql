const Product = require("../models/Product");

// Function to get all products
exports.getProducts = (req) => {
  return (
    req.user
      .getProducts()
      // return Product.findAll() // Fetch all products
      .then((products) => {
        console.log("All Products", products);

        return products;
      })
      .catch((error) => {
        console.log("get all products", error);

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
          res.status(500).send("Product not found");
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

exports.removeProductFromCart = (req, res, next) => {
  const prodId = req.body.prodId;

  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({
        where: { id: prodId },
      });
    })
    .then((products) => {
      if (products.length === 0) {
        return res.status(404).json({ message: "Product not found in cart" });
      }

      const product = products[0];

      // Ensure that cartItem is available
      if (!product.CartItem) {
        return res
          .status(404)
          .json({ message: "Product not associated with cart" });
      }

      return product.CartItem.destroy();
    })
    .then(() => {
      res.status(200).json({ message: "Product removed from cart" });
    })
    .catch((err) => {
      console.error("Error deleting product from cart:", err);
      res.status(500).send(err);
    });
};

exports.createOrder = async (req, res, next) => {
  try {
    // Get the user's cart
    const cart = await req.user.getCart();
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Get all products from the cart
    const products = await cart.getProducts();
    if (products.length === 0) {
      return res.status(400).json({ message: "No products in the cart" });
    }

    // Create a new order for the user
    const order = await req.user.createOrder();

    // Add products to the order with their quantities
    await order.addProducts(
      products.map((product) => {
        product.OrderItem = { quantity: product.CartItem.quantity };
        return product;
      })
    );

    // Clear the cart after the order is created
    await cart.setProducts(null); // Removes all products from the cart

    // Send success response
    res
      .status(201)
      .json({ message: "Order Created successfully", data: order });
  } catch (err) {
    console.error("Error Creating Order:", err);
    res
      .status(500)
      .json({ message: "Failed to create order", error: err.message });
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    // Fetch orders including associated products
    const orders = await req.user.getOrders({
      include: [
        {
          model: Product, // Include the Product model
          through: { attributes: ["quantity"] }, // Specify attributes from the join table (OrderItem)
        },
      ],
    });

    res.status(200).json(orders); // Send the orders with associated products
  } catch (err) {
    console.error("Failed to get orders:", err);
    res
      .status(500)
      .json({ message: "Failed to get orders", error: err.message });
  }
};
