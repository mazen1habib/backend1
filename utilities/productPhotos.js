const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload/product/productPhoto/");
  },
  filename: (req, file, cb) => {
    let oname = file.originalname.split(".");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "." + oname[1]);
  },
});
const fileFilter = (req, file, cb) => {
  let types = file.mimetype.split("/")[0];
  if (types == "image") {
    cb(null, true);
  } else {
    cb(null, false);
    console.log("please enter image ");
  }
};
const upload = multer({ storage, fileFilter });
module.exports = upload;
