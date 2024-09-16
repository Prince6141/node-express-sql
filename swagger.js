const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Shop API",
      version: "1.0.0",
      description: "A simple Express Shop API",
    },
    servers: [
      {
        url: "http://localhost:8080/shop", // Replace with your server URL
      },
      {
        url: "http://localhost:8080/admin", // Server URL for admin routes
      },
    ],
  },
  apis: ["./routes/shop.js", "./routes/admin.js"], // Path to the API docs, adjust if needed
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};
