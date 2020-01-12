const jwt = require('jsonwebtoken');
require('dotenv/config');

verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        const decoded = jwt.verify(token, process.env.SECRET);
        req.userData = decoded;
        next();
    } catch (error) {
        // console.log(error)
        return res.status(401).json({
            message: 'Please log in/register first!'
        })
        
    }
};

module.exports = {
    verifyToken,
    wrongRoute
}