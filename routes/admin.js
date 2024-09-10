const express = require("express");
const { postAddProduct } = require("../controllers/admin");

const router = express.Router();

router.post("/add-products", async (req, res) => {
  try {
    // Await the postAddProduct function call
    const products = await postAddProduct(req);

    // If products == 1, return success response
    if (products === 1) {
      return res.status(201).json({
        message: "Product added successfully!",
        Status: "Success",
      });
    }

    // In case products is not 1, handle the error case
    return res.status(400).json({
      message: "Failed to add product",
      Status: "Error",
    });
  } catch (err) {
    // Handle error case
    return res.status(500).json({
      message: err.message || "An error occurred",
      Status: "Error",
    });
  }
});

module.exports = router;
