const express = require("express");
let usercontroller = require("../controller/usercontroller.js");
const validateuser = require("../middleware/validations/uservalidation.js");
const authValidation = require("../middleware/validations/authvalidation.js");
const router = express.Router();
router.route("/user/Register").post(validateuser(), usercontroller.adduser);
router.route("/alluser").get(usercontroller.getalluser);
router
  .route("/user/update/:id")
  .patch(validateuser(), usercontroller.updateuser);
router
  .route("/user/restpawword/password")
  .post(usercontroller.restPasswordCode);
router.route("/user/login").post(authValidation(), usercontroller.userlogin);
router.route("/user/newpassword").post(usercontroller.restPasswordvild);
router.route("/user/profile").get(usercontroller.profile);
module.exports = router;
