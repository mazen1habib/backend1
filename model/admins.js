const mongoose = require("mongoose");
let adminschema = mongoose.Schema({
  adminName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  registered: Date,
  lastLogged: Date,
  restPassword: Number,
});
let adminmodel = mongoose.model("Admin", adminschema);
module.exports = adminmodel;
