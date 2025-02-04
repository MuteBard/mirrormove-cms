const { JWT } = require("../../settings");
const jwt = require("jsonwebtoken");

function generateToken() {
    console.log(JWT)
    return jwt.sign({}, JWT.secretKey, { expiresIn: '15s' }); 
}

exports.generateToken = generateToken;