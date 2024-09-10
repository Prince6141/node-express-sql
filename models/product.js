const db = require("../Utils/database");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.price = price;
  }

  // Save should be an instance method
  save() {
    return db.execute(
      "INSERT INTO products (title, price, description, imageUrl) VALUES (?,?,?,?)",
      [this.title, this.price, this.description, this.imageUrl]
    );
  }

  // Static method to fetch all products
  static fetchAll() {
    return db.execute("SELECT * FROM products;");
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
  }
};
