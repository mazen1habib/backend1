const Admin = require("../model/admins.js");
const bcrypt = require("bcrypt");
const responsemsgs = require("../utilities/responseMsgs.js");
const responce = require("../utilities/httpresponemsg.js");
const { validationResult } = require("express-validator");
const signJwt = require("../utilities/signJWT.js");
const getUserDateFromToken = require("../utilities/getUserDateFromToken.js");
let addadmin = async (req, res) => {
  try {
    let val = await validationResult(req).errors;
    if (val.length != 0) {
      throw val;
    } else {
      let data = await req.body;
      let hashpassword = await bcrypt.hash(data.password, 5);
      let newadmin = await new Admin({
        adminName: data.adminName,
        email: data.email,
        password: hashpassword,
        phone: data.phone,
        address: data.address,
        registered: Date.now(),
        lastLogged: Date.now(),
      });
      let done = await newadmin.save();
      if (done.email != data.email) {
        throw "Something Went Wrong, Please Try Again";
      } else {
        responce(res, 200, responsemsgs.SUCCESS, "Registered Successfully");
      }
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

let adminlogin = async (req, res) => {
  try {
    let data = await req.body;
    if (!data.email || !data.password) {
      throw "please enter email or password ";
    } else {
      let checkdata = await Admin.findOne({ email: data.email });
      if (!checkdata) {
        throw "User Not Found";
      } else {
        let comparepassword = await bcrypt.compare(
          data.password,
          checkdata.password
        );
        if (comparepassword != 1) {
          throw "Missing Password";
        } else {
          let token = await signJwt({
            AdminID: checkdata._id,
            AdminName: checkdata.adminName,
          });
          res.status(200).cookie("jwt", token).json({
            status: responsemsgs.SUCCESS,
            data: token,
          });
        }
      }
    }
    res.end();
  } catch (er) {
    res.status(400).json({
      status: responsemsgs.FAIL,
      data: er,
    });
  }
};
let updateadmin = async (req, res) => {
  try {
    let val = await validationResult(req).errors;
    if (val.length != 0) {
      throw val;
    } else {
      let pid = await req.params.id;
      // console.log(pid);
      let adminDate = await getUserDateFromToken(req);
      if (pid == adminDate._id) {
        let newdata = await req.body;
        let hashpasswordup = await bcrypt.hash(newdata.password, 5);
        let newupdatedata = await Admin.updateOne(
          { _id: pid },
          {
            adminName: newdata.adminName,
            email: newdata.email,
            password: hashpasswordup,
            phone: newdata.phone,
            address: newdata.address,
          }
        );
        if (newupdatedata.matchedCount != 1) {
          throw "Admin Not Found";
        } else {
          if (newupdatedata.modifiedCount != 1) {
            throw "Nothing Updated";
          } else {
            responce(
              res,
              200,
              responsemsgs.SUCCESS,
              "updated Successfully",
              null
            );
          }
        }
      } else {
        throw "there is an error in the admin id";
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
let restpassordcode = async (req, res) => {
  try {
    let inputemail = await req.body.email;
    if (!inputemail) {
      throw "please enter your email";
    } else {
      let checkemail = await Admin.findOne({ email: inputemail });
      if (!checkemail) {
        throw "User Not Found";
      } else {
        let rademcode = await Math.round(Math.random() * 10000);
        let newradem = await Admin.updateOne(
          { email: checkemail.email },
          {
            restPassword: rademcode,
          }
        );
        if (newradem.matchedCount != 1) {
          throw "Admin Not Found";
        } else {
          if (newradem.modifiedCount != 1) {
            throw "Nothing Updated";
          } else {
            responce(
              res,
              200,
              responsemsgs.SUCCESS,
              "Code Sent In Your Email",
              rademcode
            );
          }
        }
      }
    }
  } catch {
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
let restpasswordvild = async (req, res) => {
  try {
    let data = await req.body;
    if (!data.email || !data.password || !data.code) {
      throw "please enter your email,password or code";
    } else {
      let checkadmin = await Admin.findOne({ email: data.email });
      if (!checkadmin) {
        throw "email not found";
      } else {
        if (checkadmin.restPassword != data.code) {
          throw "code not found";
        } else {
          let hashpassworvild = await bcrypt.hash(data.password, 5);
          let updatepassword = await Admin.updateOne(
            { email: data.email },
            {
              password: hashpassworvild,
            }
          );
          if (updatepassword.modifiedCount != 1) {
            throw "Nothing Updated";
          } else {
            responce(
              res,
              200,
              responsemsgs.SUCCESS,
              "updated your password",
              null
            );
            let daleterest = await Admin.updateOne(
              { _id: checkadmin._id },
              {
                restPassword: null,
              }
            );
          }
        }
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
module.exports = {
  addadmin,
  adminlogin,
  updateadmin,
  restpassordcode,
  restpasswordvild,
};
