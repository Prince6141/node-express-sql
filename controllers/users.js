const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;

  // Check if all fields are required
  if (!name || !email || !password || !req.file) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if the user already exists
  User.findOne({ where: { email } })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(409)
          .json({ message: "User with this email already exists" });
      }

      // Hash the password
      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      // Get the profile image file path
      const profileImage = `/uploads/${req.file.filename}`;

      // Create the new user
      return User.create({
        name,
        email,
        password: hashedPassword,
        profileImage,
      });
    })
    .then((newUser) => {
      // Respond with success message
      return res.status(201).json({
        message: "User registered successfully",
        user: {
          name: newUser.name,
          email: newUser.email,
          profileImage: newUser.profileImage,
        },
      });
    })
    .catch((error) => {
      console.error("Error registering user:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    });
};
