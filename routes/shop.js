const express = require("express");
const router = express.Router();
const { getProducts, getProduct, deleteProduct, updateProduct } = require("../controllers/shop");

/**
 * @swagger
 * /get-all-products:
 *   get:
 *     summary: Retrieve a list of all products
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: No products found
 *       500:
 *         description: Internal server error
 */
router.get("/get-all-products", async (req, res) => {
  try {
    const products = await getProducts();
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products); // Use JSON for consistency
  } catch (err) {
    console.error("get-all-products error", err);
    res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
  }
});

/**
 * @swagger
 * /get-product/{id}:
 *   get:
 *     summary: Retrieve a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID
 *     responses:
 *       200:
 *         description: A product object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get("/get-product/:id", async (req, res) => {
  const id = req.params.id;

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await getProduct(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error("get-product error", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

/**
 * @swagger
 * /remove-product/{id}:
 *   delete:
 *     summary: Remove a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete("/remove-product/:id", async (req, res) => {
  const id = req.params.id;

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const result = await deleteProduct(id);
    if (result.message === 'Product deleted successfully') {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error("remove-product error", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

/**
 * @swagger
 * /update-product/{id}:
 *   put:
 *     summary: Update a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID
 *     requestBody:
 *       description: Updated product data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put("/update-product/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const result = await updateProduct(id, updateData);
    if (result.message === 'Product updated successfully') {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error("update-product error", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;
