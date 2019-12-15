var symbols = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
var passwordTest = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;
var cardTestVisa = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;


errorHandler = (err, req, res, next) => {
    var errorObj = {
        message: err.message
    };
    res.status(400).json(errorObj);
}; 

wrongRoute = (req, res) => {
    var wrongRouteErrorObj = {
        message: 'Wrong route. Please try with another one.'
    };
    res.status(404).json(wrongRouteErrorObj);
};

module.exports = {
    symbols,
    passwordTest,
    cardTestVisa,
    errorHandler,
    wrongRoute
}