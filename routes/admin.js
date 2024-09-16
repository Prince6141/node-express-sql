const express = require("express");
const { postAddProduct } = require("../controllers/admin");

const router = express.Router();

/**
 * @swagger
 * /add-products:
 *   post:
 *     summary: Add a new product
 *     description: This route allows you to add a new product to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *               - description
 *               - imageUrl
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the product.
 *               price:
 *                 type: number
 *                 description: Price of the product.
 *               description:
 *                 type: string
 *                 description: Description of the product.
 *               imageUrl:
 *                 type: string
 *                 description: URL of the product image.
 *     responses:
 *       201:
 *         description: Product added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 Status:
 *                   type: string
 *       400:
 *         description: Failed to add product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 Status:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 Status:
 *                   type: string
 */
router.post("/add-products", async (req, res) => {
  try {
    // Assume postAddProduct now handles the updated fields
    const products = await postAddProduct(req);

    if (products) {
      return res.status(201).json({
        message: "Product added successfully!",
        Status: "Success",
      });
    }

    return res.status(400).json({
      message: "Failed to add product",
      Status: "Error",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "An error occurred",
      Status: "Error",
    });
  }
});

module.exports = router;
