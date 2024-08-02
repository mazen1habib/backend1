const placetableorder = require("../model/ordertable.js");
const user = require("../model/user.js");
const Product = require("../model/product.js");
const responsemsgs = require("../utilities/responseMsgs.js");
const responce = require("../utilities/httpresponemsg.js");
const { validationResult } = require("express-validator");
const getUserDateFromToken = require("../utilities/getUserDateFromToken.js");
let addordertable = async (req, res) => {
  try {
    let val = await validationResult(req).errors;
    if (val?.length != 0) {
      throw val;
    } else {
      let data = await req.body;
      let userDate = await getUserDateFromToken(req);
      let checkuser = await user.findOne({ _id: userDate._id });
      if (!checkuser) {
        throw "User Not Found";
      } else {
        let checktime = await placetableorder.findOne({
          mealTime: data.mealTime,
          mealDate: data.mealDate,
        });
        if (checktime) {
          throw "This Appointment has been booked ";
        } else {
          let ppalcesorder = await new placetableorder({
            userId: userDate._id,
            nameofuser: data.nameofuser,
            mealTime: data.mealTime,
            mealDate: data.mealDate,
            phone: data.phone,
            paymentType: checkuser.creditCard,
            totalPerson: data.totalPerson,
          });
          let done = ppalcesorder.save();
          if (!done) {
            throw "Something Went Wrong,Please Try Again";
          } else {
            let icrement1 = await user.updateOne(
              { _id: userDate._id },
              {
                $inc: { numberOfOrders: 1 },
              }
            );
            if (icrement1.modifiedCount != 1) {
              throw "something went wrong";
            } else {
              responce(
                res,
                200,
                responsemsgs.SUCCESS,
                "Successfully Added",
                null
              );
            }
          }
        }
      }
    }
  } catch (er) {
    let errors = [];
    if (er?.message) {
      errors = [er.message];
    } else if (er[0]?.location) {
      errors = er.map((e) => e.msg);
    } else {
      errors = [er];
    }
    responce(res, 400, responsemsgs.FAIL, errors, null);
  }
  res.end();
};
let getallorder = async (req, res) => {
  try {
    let alldata = await placetableorder.find({});
    responce(res, 200, responsemsgs.SUCCESS, alldata, null);
  } catch (er) {
    responce(res, 400, responsemsgs.FAIL, er, null);
  }
  res.end();
};
let getallorderinsameuser = async (req, res) => {
  try {
    let userDate = await getUserDateFromToken(req);
    let alldata = await placetableorder.find({ userId: userDate._id });
    responce(res, 200, responsemsgs.SUCCESS, alldata, null);
  } catch (er) {
    responce(res, 400, responsemsgs.FAIL, er, null);
  }
  res.end();
};

let singleorder = async (req, res) => {
  try {
    let pid = await req.params.id;
    let singleorderdata = await placetableorder.findOne({ _id: pid });
    if (!singleorderdata) {
      throw "not found this order";
    } else {
      responce(res, 200, responsemsgs.SUCCESS, singleorderdata, null);
    }
  } catch (er) {
    responce(res, 400, responsemsgs.FAIL, er, null);
  }
  res.end();
};
let confirmorder = async (req, res) => {
  try {
    let pid = await req.params.id;
    let updatedata = await placetableorder.updateOne(
      { _id: pid },
      {
        isDone: true,
      }
    );
    if (updatedata.modifiedCount == 0) {
      throw "Nothing confirm";
    } else {
      responce(res, 200, responsemsgs.SUCCESS, "Successfully confirm", null);
    }
  } catch (er) {
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
let deleteorder = async (req, res) => {
  try {
    let pid = await req.params.id;
    let del = await placetableorder.deleteOne({ _id: pid });
    if (del.deletedCount == 0) {
      throw "Nothing deleted";
    } else {
      responce(res, 200, responsemsgs.SUCCESS, "delete Successfully", null);
    }
  } catch (er) {
    if (er?.message) {
      responce(res, 400, responsemsgs.FAIL, er.message, null);
    } else {
      responce(res, 400, responsemsgs.FAIL, er, null);
    }
  }
  res.end();
};
module.exports = {
  addordertable,
  getallorder,
  getallorderinsameuser,
  singleorder,
  confirmorder,
  deleteorder,
};
