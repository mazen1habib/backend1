const decodejwt = require("./decodeJWT.js");
const admin = require("../model/admins.js");
const User = require("../model/user.js");
let getUserDateFromToken = async (req) => {
  let token = await req.cookies.jwt;
  let tokenData = await decodejwt(token);
  let adminDate = await admin
    .findOne({ _id: tokenData.AdminID })
    .select(["_id", "adminName", "email"]);
  if (adminDate === 1) {
    return adminDate;
  } else {
    let userDate = await User.findOne({ _id: tokenData.userID }).select([
      "_id",
      "userName",
      "email",
    ]);
    return userDate;
  }
};
module.exports = getUserDateFromToken;
