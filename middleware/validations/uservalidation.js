const { body } = require("express-validator");
const User = require("../../model/user.js");
let uservalidation = () => {
  return [
    body("userName")
      .notEmpty()
      .withMessage("the name does not exist , please write the name"),
    body("email")
      .notEmpty()
      .withMessage("email can't be empty ")
      .custom(async (n) => {
        let users = await User.findOne({ email: n });
        if (users) {
          throw "User Already Be Exists With This Email";
        }
      }),
    body("phone")
      .notEmpty()
      .withMessage("please enter you mobile phone")
      .custom(async (n) => {
        let users = await User.findOne({ phone: n });
        if (users) {
          throw "User Already Be Exists With This phone";
        }
      }),
  ];
};
module.exports = uservalidation;
