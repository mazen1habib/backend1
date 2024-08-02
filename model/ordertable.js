const mongoose = require("mongoose");
let tableschema = mongoose.Schema({
  userId: String,
  nameofuser: String,
  mealTime: String,
  mealDate: String,
  phone: String,
  paymentType: String,
  totalPerson: Number,
  isDone: { type: Boolean, default: false },
});
let tablemodel = mongoose.model("OrderTable", tableschema);
module.exports = tablemodel;
