let decodeJwt = require("../utilities/decodeJWT.js");
const responsemsgs = require("../utilities/responseMsgs.js");
const responce = require("../utilities/httpresponemsg.js");
const Admin = require("../model/admins.js");
let checkAdmin = async (req, res, next) => {
  try {
    let token = await req.cookies.jwt;
    if (!token) {
      throw "Please Login - No Token Provided";
    }

    let checktoken = await decodeJwt(token);
    if (!checktoken) {
      throw "Invalid Token";
    } else {
      let checkadmins = await Admin.findOne({ _id: checktoken.AdminID });
      if (!checkadmins) {
        throw "You Are Not Allowed Here";
      } else {
        next();
      }
    }
  } catch (er) {
    responce(res, 400, responsemsgs.FAIL, er, null);
  }
};
module.exports = checkAdmin;
