const Jwt = require("jsonwebtoken");
let decodejwt = async (token) => {
  let decodeData = await Jwt.verify(
    token,
    `jnjhinsshshs8ansi@hjehuhu&jbjb*okoj`
  );
  return decodeData;
};
module.exports = decodejwt;
