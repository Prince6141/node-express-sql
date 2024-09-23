const express = require("express");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { registerUser } = require("../controllers/users");
const { getCart, postCart } = require("../controllers/shop");

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage: storage });

// Route to register a user with profile image upload
router.post("/register-user", upload.single("profileImage"), registerUser);

router.get("/get-cart-details", getCart);

router.post("/addToCart", postCart);

module.exports = router;
