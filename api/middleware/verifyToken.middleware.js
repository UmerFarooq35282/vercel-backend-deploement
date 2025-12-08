const JWT = require("jsonwebtoken");
const { ErrorResponse } = require("../utils/sendingResponse.js");

const verifyToken = (req, res, next) => {
    const secret_key = process.env.JWT_SECRET;

    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) throw new ErrorResponse("Token not Found", 400)

    console.log(token, "Secret Key", secret_key);

    const decode = JWT.verify(token, secret_key)
    console.log("decode", decode);

    if (!decode) throw new ErrorResponse(`Invalid Token ${token}`, 401)
    req.user = decode
    next();
}

module.exports = { verifyToken }