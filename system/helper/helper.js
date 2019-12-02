var symbols = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
var passwordTest = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;
var cardTestVisa = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;



module.exports = {
    symbols,
    passwordTest,
    cardTestVisa
}