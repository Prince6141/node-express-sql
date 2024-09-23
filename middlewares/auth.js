const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  // Check if the token is provided
  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied" });
  }

  try {
    // Extract the token from 'Bearer <token>'
    const actualToken = token.split(" ")[1];

    // Verify the token using your secret key
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    // decoded now contains the user payload (e.g., { id: <userId>, email: <userEmail> })
    const userId = decoded.id;

    // Find the user by the ID from the token
    User.findByPk(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Attach the user object to the request
        req.user = user;
        next();
      })
      .catch((err) => {
        console.error("Error finding user:", err);
        return res.status(500).json({ message: "Server error" });
      });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;
