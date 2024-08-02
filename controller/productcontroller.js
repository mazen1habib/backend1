const product = require("../model/product.js");
const responsemsgs = require("../utilities/responseMsgs.js");
const responce = require("../utilities/httpresponemsg.js");
const { validationResult } = require("express-validator");
let addproduct = async (req, res) => {
  try {
    let val = await validationResult(req).errors;
    if (val?.length != 0) {
      throw val;
    } else {
      let imagespath = await req.files;
      // console.log(imagespath);
      let mean = imagespath.imagemean[0];
      let mean1 = "http://localhost:4000/" + mean.destination + mean.filename;
      let imgesall = imagespath.images;
      let images = imgesall.map((e) => {
        let p = "http://localhost:4000/" + e.destination + e.filename;
        return p;
      });
      let newProductData = await req.body;
      let newProduct = await new product({
        productName: newProductData.productName,
        productPrice: newProductData.productPrice,
        productDescription: newProductData.productDescription,
        productQuantity: newProductData.productQuantity,
        productCategory: newProductData.productCategory,
        imagemean: mean1,
        images: images,
      });
      let done = await newProduct.save();
      if (done.productName != newProduct.productName) {
        throw "Something Went Wrong, Please Try Again";
      } else {
        responce(res, 200, responsemsgs.SUCCESS, "succefully added", null);
      }
    }
  } catch (er) {
    // let path = image.destination +  image.filename
    let errors = [];
    if (er?.message) {
      errors = er.message;
    } else if (er[0]?.location) {
      errors = er.map((e) => e.msg);
    } else {
      errors = er;
    }
    responce(res, 400, responsemsgs.FAIL, errors, null);
  }
  res.end();
};
let getallproduct = async (req, res) => {
  try {
    let allproduct = await product.find({});
    responce(res, 200, responsemsgs.SUCCESS, allproduct, null);
  } catch (er) {
    responce(res, 400, responsemsgs.FAIL, er, null);
  }
  res.end();
};
let findproduct = async (req, res) => {
  try {
    let allproduct = await product.find({
      productName: { $regex: `/[A-Z] ${req.query.search}/` },
    });
    responce(res, 200, responsemsgs.SUCCESS, allproduct, null);
  } catch (er) {
    responce(res, 400, responsemsgs.FAIL, er, null);
  }
  res.end();
};
let singleproduct = async (req, res) => {
  try {
    let pid = req.params.id;
    let singlepro = await product.findOne({ _id: pid });
    responce(res, 200, responsemsgs.SUCCESS, singlepro, null);
    res.end();
  } catch (er) {
    responce(res, 400, responsemsgs.FAIL, er, null);
  }
};
let categoryfind = async (req, res) => {
  try {
    let pid = req.params.id;
    let findproduct = await product.find({ productCategory: pid });
    if (!findproduct) {
      throw "can not fount this product";
    } else {
      responce(res, 200, responsemsgs.SUCCESS, findproduct, null);
    }
  } catch (er) {
    responce(res, 400, responsemsgs.FAIL, er, null);
  }
  res.end();
};
let updateproduct = async (req, res) => {
  try {
    let pid = await req.params.id;
    let val = await validationResult(req).errors;
    if (val.length != 0) {
      throw val;
    } else {
      let newproduct = await req.body;
      let imagespath = await req.files;
      // console.log(imagespath);
      let mean = imagespath.imagemean[0];
      let mean1 = "http://localhost:4000/" + mean.destination + mean.filename;
      let imgesall = imagespath.images;
      let images = imgesall.map((e) => {
        let p = "http://localhost:4000/" + e.destination + e.filename;
        return p;
      });
      let updatepro = await product.updateOne(
        { _id: pid },
        {
          productName: newproduct.productName,
          productPrice: newproduct.productPrice,
          productDescription: newproduct.productDescription,
          productQuantity: newproduct.productQuantity,
          productCategory: newproduct.productCategory,
          imagemean: mean1,
          images: images,
        }
      );
      // console.log(updatepro);
      if (updatepro.modifiedCount == 0) {
        throw "Nothing Updated";
      } else {
        responce(res, 200, responsemsgs.SUCCESS, "update Successfully", null);
      }
    }
  } catch (er) {
    let errors = [];
    if (er[0]?.location) {
      errors = er.map((e) => e.msg);
    } else if (er?.message) {
      errors = er.message;
    } else {
      errors = er;
    }
    responce(res, 400, responsemsgs.FAIL, errors, null);
  }
  res.end();
};
let deleteproduct = async (req, res) => {
  try {
    let pid = await req.params.id;
    let del = await product.deleteOne({ _id: pid });
    if (del.deletedCount == 0) {
      throw "Nothing deleted";
    } else {
      responce(res, 200, responsemsgs.SUCCESS, "delete Successfully", null);
    }
    res.end();
  } catch (er) {
    responce(res, 400, responsemsgs.FAIL, er, null);
  }
};
module.exports = {
  addproduct,
  getallproduct,
  singleproduct,
  updateproduct,
  deleteproduct,
  findproduct,
  categoryfind,
};
