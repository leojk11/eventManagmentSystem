const jwt = require('jsonwebtoken');
require('dotenv/config');

function verifyToken(req, res, next){
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'secret');
        req.userData = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: 'Please log in/register first!'
        })
        
    }
}

module.exports = {
    verifyToken
}