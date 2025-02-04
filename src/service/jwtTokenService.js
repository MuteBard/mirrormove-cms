const { JWT } = require("../../settings");
const jwt = require("jsonwebtoken");

function generateToken() {
    return jwt.sign({}, JWT.secretKey, { expiresIn: '15s' }); 
}

exports.generateToken = generateToken;