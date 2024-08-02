const { body } = require("express-validator");
const Admins = require("../../model/admins.js");
let adminvalidation = () => {
  return [
    body("adminName").notEmpty().withMessage("Name Can't Be Empty "),
    body("email")
      .notEmpty()
      .withMessage("email can't be empty ")
      .custom(async (n) => {
        let admins = await Admins.findOne({ email: n });
        if (admins) {
          throw "Admin Already Be Exists With This Email";
        }
      }),
    body("password").notEmpty().withMessage("password can't be empty "),
    body("phone")
      .notEmpty()
      .withMessage("phone can't be empty ")
      .custom(async (n) => {
        let admins = await Admins.findOne({ phone: n });
        if (admins) {
          throw "Admin Phone Already Be Exists With This Phone";
        }
      }),
  ];
};
module.exports = adminvalidation;
