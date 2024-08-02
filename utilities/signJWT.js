const Jwt = require("jsonwebtoken");
let siginjwt = async (payload) => {
  let token = Jwt.sign(payload, `jnjhinsshshs8ansi@hjehuhu&jbjb*okoj`);
  return token;
};
module.exports = siginjwt;
