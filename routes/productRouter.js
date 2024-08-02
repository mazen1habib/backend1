const productcontroller = require("../controller/productcontroller.js");
const validatedproduct = require("../middleware/validations/productvalidation.js");
const uploadimges = require("../utilities/productPhotos.js");
const adminMiddlewre = require("../middleware/adminsMiddleware.js");
const express = require("express");
const router = express.Router();
router
  .route("/products")
  .post(
    [
      uploadimges.fields([
        { name: "imagemean", maxCount: 1 },
        { name: "images", maxCount: 3 },
      ]),
      adminMiddlewre,
      validatedproduct(),
    ],
    productcontroller.addproduct
  )
  .get(productcontroller.getallproduct);
router.route("/product/:search").get(productcontroller.findproduct);
router
  .route("/products/:id")
  .get(productcontroller.singleproduct)
  .patch(
    [
      uploadimges.fields([
        { name: "imagemean", maxCount: 1 },
        { name: "images", maxCount: 3 },
      ]),
      adminMiddlewre,
      validatedproduct(),
    ],
    productcontroller.updateproduct
  )
  .delete(adminMiddlewre, productcontroller.deleteproduct);
router.route("/products/Category/:id").get(productcontroller.categoryfind);
module.exports = router;
// validatedproduct(),
