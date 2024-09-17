const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const sequelize = require("./Utils/database");
const rootDir = require("./Utils/path");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const userRoutes = require("./routes/userRoutes");
const { specs, swaggerUi } = require("./swagger");
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serving static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/admin", adminRoutes);
app.use("/shop", shopRoutes);
app.use("/user", userRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});

// Synchronize database and start server
sequelize
  .sync({ alter: true })
  .then((result) => {
    console.log("Database synchronized successfully.");
    app.listen(PORT, () => {
      console.log(`Server is listening on port : ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error synchronizing the database:", error);
  });
