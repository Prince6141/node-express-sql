const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register User (unchanged)
exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password, req.file);

  if (!name || !email || !password || !req.file) {
    return res.status(400).json({ message: "All fields are required" });
  }

  User.findOne({ where: { email } })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(409)
          .json({ message: "User with this email already exists" });
      }

      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      const profileImage = `/uploads/${req.file.filename}`;

      return User.create({
        name,
        email,
        password: hashedPassword,
        profileImage,
      });
    })
    .then((newUser) => {
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

// Login User with token in response
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  User.findOne({ where: { email } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET, // Secure your secret key
          { expiresIn: "1h" } // Token expiration time
        );

        // Send response with token and user data
        return res.status(200).json({
          message: "Login successful",
          token, // Token sent in response
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
          },
        });
      });
    })
    .catch((error) => {
      console.error("Error during login:", error);
      return res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    });
};
