const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "E-Commerce API",
    description: "API documentation for E-Commerce project",
  },
  host: "localhost:8080", // Adjust to your environment
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [
  "./routes/admin.js",
  "./routes/shop.js",
  "./routes/userRoutes.js",
]; // Route files

// Generate Swagger docs, then start the server
swaggerAutogen(outputFile, endpointsFiles).then(() => {
  // Starting the server using nodemon
  require("./index"); // This points to your app's entry point
});
