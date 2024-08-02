const { body } = require("express-validator");
const placetableorder = require("../../model/ordertable.js");
const ordertablevalidation = () => {
  return [
    body("nameofuser")
      .notEmpty()
      .withMessage("please enter the username element"),
    body("mealTime").notEmpty().withMessage("please enter the booking time"),
    body("mealDate").notEmpty().withMessage("please enter the booking day"),
    body("phone").notEmpty().withMessage("please enter the phone element"),
    body("totalPerson")
      .notEmpty()
      .withMessage("please enter the number of people"),
  ];
};
module.exports = ordertablevalidation;
