const tablecontroller = require("../controller/tablecontroller.js");
const tablevalidation = require("../middleware/validations/ordertablevalidation.js");
const express = require("express");
const router = express.Router();
router
  .route("/placetable")
  .post(tablevalidation(), tablecontroller.addordertable);
router.route("/table").get(tablecontroller.getallorder);
router.route("/allTable").get(tablecontroller.getallorderinsameuser);
router
  .route("/placetable/:id")
  .get(tablecontroller.singleorder)
  .delete(tablecontroller.deleteorder);
router.route("/table/:id").patch(tablecontroller.confirmorder);
module.exports = router;
