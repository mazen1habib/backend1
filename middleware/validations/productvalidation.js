const { body } = require("express-validator");
const productvalidation = () => {
  return [
    body("productName").notEmpty().withMessage("ProductName can't be fadiii"),
    body("productPrice").notEmpty().withMessage("ProductPrice can't be fadiii"),
  ];
};
module.exports = productvalidation;
