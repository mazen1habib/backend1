const mongoose = require("mongoose");
let productschema = mongoose.Schema({
  productName: String,
  productPrice: String,
  productDescription: { type: String },
  productQuantity: { type: Number, default: 0 },
  productCategory: { type: String },
  soldQantity: { type: Number, default: 0 },
  imagemean: String,
  images: Array,
});
let productModel = mongoose.model("Product", productschema);
module.exports = productModel;
