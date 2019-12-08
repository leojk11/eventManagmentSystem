const jwt = require('jsonwebtoken');
require('dotenv/config');

verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'secret');
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Please log in/register first!'
        })
        
    }
};

module.exports = {
    verifyToken,
    wrongRoute
}