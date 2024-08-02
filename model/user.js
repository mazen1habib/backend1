const mongoose = require("mongoose");
let userschema = mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  numberOfOrders: { type: Number, default: 0 },
  creditCard: { type: String },
  registered: Date,
  lastLogged: Date,
  restPassword: Number,
});
let usermodel = mongoose.model("User", userschema);
module.exports = usermodel;
