const user = require("../model/user.js");
const bycrpt = require("bcrypt");
const responsemsgs = require("../utilities/responseMsgs.js");
const responce = require("../utilities/httpresponemsg.js");
const { validationResult } = require("express-validator");
const signJwt = require("../utilities/signJWT.js");
const getUserDateFromToken = require("../utilities/getUserDateFromToken.js");
let adduser = async (req, res) => {
  try {
    let val = await validationResult(req).errors;
    if (val?.length != 0) {
      throw val;
    } else {
      let newdata1 = await req.body;
      let hashpassword = await bycrpt.hash(newdata1.password, 5);
      let newdatauser = await new user({
        userName: newdata1.userName,
        email: newdata1.email,
        password: hashpassword,
        phone: newdata1.phone,
        address: newdata1.address,
        creditCard: newdata1.creditCard,
        registered: Date.now(),
        lastLogged: Date.now(),
      });
      let done = await newdatauser.save();
      if (done.email != newdata1.email) {
        throw "Registered Nothing Successfully";
      } else {
        responce(
          res,
          200,
          responsemsgs.SUCCESS,
          "Registered Successfully",
          null
        );
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
let updateuser = async (req, res) => {
  try {
    let val = await validationResult(req).errors;
    if (val?.length != 0) {
      throw val;
    } else {
      let pid = await req.params.id;
      let userDate = await getUserDateFromToken(req);
      if (pid == userDate._id) {
        let newdata = await req.body;
        let hashpasswordup = await bycrpt.hash(newdata.password, 5);
        let newuser = await user.updateOne(
          { _id: pid },
          {
            userName: newdata.userName,
            email: newdata.email,
            password: hashpasswordup,
            phone: newdata.phone,
            address: newdata.address,
            creditCard: newdata.creditCard,
          }
        );
        if (newuser.matchedCount != 1) {
          throw "user Not Found";
        } else {
          if (newuser.modifiedCount != 1) {
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
let restPasswordCode = async (req, res) => {
  try {
    let useremail = await req.body.email;
    if (!useremail) {
      throw "please enter your email";
    } else {
      let checkemail = await user.findOne({ email: useremail });
      if (!checkemail) {
        throw "User Not Found";
      } else {
        let redamrest = await Math.round(Math.random() * 1000);
        let rest = await user.updateOne(
          { email: useremail },
          {
            restPassword: redamrest,
          }
        );
        if (rest.matchedCount != 1) {
          throw "Admin Not Found";
        } else {
          if (rest.modifiedCount != 1) {
            throw "Nothing Updated";
          } else {
            responce(
              res,
              200,
              responsemsgs.SUCCESS,
              "Code Sent In Your Email",
              redamrest
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
let userlogin = async (req, res) => {
  try {
    let credentials = await req.body;
    if (!credentials.email || !credentials.password) {
      throw "please enter email or password ";
    } else {
      let checkuser = await user.findOne({ email: credentials.email });
      if (!checkuser) {
        throw "User Not Found";
      } else {
        let checkpassowrd = await bycrpt.compare(
          credentials.password,
          checkuser.password
        );
        if (checkpassowrd != 1) {
          throw "Missing password";
        } else {
          let uplogin1 = await user.updateOne(
            { _id: checkuser._id },
            {
              lastLogged: Date.now(),
            }
          );
          if (uplogin1.matchedCount != 1) {
            throw "user Not Found";
          } else {
            if (uplogin1.modifiedCount != 1) {
              throw "Nothing Updated";
            } else {
              let token = await signJwt({
                userID: checkuser._id,
                userName: checkuser.userName,
              });
              res.status(200).cookie("jwt", token).json({
                status: responsemsgs.SUCCESS,
                data: { token },
              });
            }
          }
        }
      }
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
let getalluser = async (req, res) => {
  try {
    let alluser = await user.find({});
    responce(res, 200, responsemsgs.SUCCESS, alluser, null);
  } catch (er) {
    responce(res, 400, responsemsgs.FAIL, er, null);
  }
  res.end();
};
let profile = async (req, res) => {
  try {
    let userDate = await getUserDateFromToken(req);
    let checkuser = await user.findOne({ _id: userDate._id });
    if (!checkuser) {
      throw "user not found";
    } else {
      responce(res, 200, responsemsgs.SUCCESS, checkuser, null);
    }
  } catch (er) {
    responce(res, 400, responsemsgs.FAIL, er, null);
  }
};
let restPasswordvild = async (req, res) => {
  try {
    let data = await req.body;
    if (!data.email || !data.code || !data.password) {
      throw "please enter your email or passowrd or code";
    } else {
      let checkuser = await user.findOne({ email: data.email });
      if (!checkuser) {
        throw "your email not correct";
      } else {
        if (data.code != checkuser.restPassword) {
          throw "your code not correct";
        } else {
          let hashpassordvild = await bycrpt.hash(data.password, 5);
          let newpassword = await user.updateOne(
            { _id: checkuser[0]._id },
            {
              password: hashpassordvild,
            }
          );
          if (newpassword.modifiedCount != 1) {
            throw "Nothing updated";
          } else {
            responce(
              res,
              200,
              responsemsgs.SUCCESS,
              "updated your password",
              null
            );
            let daleterest = await user.updateOne(
              { _id: checkuser[0]._id },
              {
                restPassword: null,
              }
            );
          }
        }
      }
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
  adduser,
  updateuser,
  restPasswordCode,
  userlogin,
  restPasswordvild,
  profile,
  getalluser,
};
