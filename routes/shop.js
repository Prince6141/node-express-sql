const express = require("express");
const router = express.Router();
const { getProducts, getProduct } = require("../controllers/shop");

router.get("/get-all-products", async (req, res) => {
  try {
    const products = await getProducts();
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).send(products);
  } catch (err) {
    console.error("get-all-products error", err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

router.get("/get-product/:id", async (req, res) => {
  const id = req.params.id;

  // Check if `id` is a number
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await getProduct(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).send(product);
  } catch (err) {
    console.error("get-product error", err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

module.exports = router;
