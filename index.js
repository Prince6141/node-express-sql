const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const db = require("./Utils/database");
const rootDir = require("./Utils/path");
const app = express();
const PORT = process.env.PORT || 8080;

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// Set extended option to true or false based on your needs
app.use(bodyParser.urlencoded({ extended: true }));

// If you are using JSON parsing
app.use(bodyParser.json());

// Serving static files (if needed)
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use("/shop", shopRoutes);

app.use("*", (req, res, next) => {
  res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});
// Mongo DB
app.listen(PORT, () => {
  console.log(`Server is listing on port : ${PORT}`);
});
