var symbols = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
var passwordTest = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;
var cardTestVisa = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;


errorHandler = (err, req, res, next) => {
    var errorObj = {
        success: false,
        message: err.message
    };

    res.status(err.status).json(errorObj);
}; 

wrongRoute = (req, res, next) => {
    var error = new Error("Route not found. Please try with another one!");
    error.status = 404;
    next(error);
};

module.exports = {
    symbols,
    passwordTest,
    cardTestVisa,
    errorHandler,
    wrongRoute
}