const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = process.env.PORT || 8080;

const sequelize = require("./Utils/database");
const rootDir = require("./Utils/path");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const userRoutes = require("./routes/userRoutes");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const CartItem = require("./models/Cart-Item");
const Order = require("./models/Order");
const OrderItem = require("./models/Order-Item");
const authMiddleware = require("./middlewares/auth");
const swaggerFile = require("./swagger-output.json");

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serving static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Swagger docs setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// app.use((req, res, next) => {
//   User.findByPk(1)
//     .then((user) => {
//       req.user = user;
//       next();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

app.use("/admin", authMiddleware, adminRoutes);
app.use("/shop", authMiddleware, shopRoutes);
app.use("/user", userRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});

// Sequelize Associations
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

// Synchronize database and start server
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synchronized successfully.");
    app.listen(PORT, () => {
      console.log(`Server is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error synchronizing the database:", error);
  });
