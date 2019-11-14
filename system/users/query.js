const connection = require('../../DB/database');

function signUpQuery(user, pass) {
    const query = 'INSERT INTO users(Name, Lastname, Username, Password, Email, Company_name, Date_registered) VALUES(?,?,?,?,?,?,NOW())';
    return new Promise((res, rej) => {
        connection.query(query, [user.Name, user.Lastname, user.Username, pass, user.Email, user.Company_name],(error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};

logInUserQuery = (username) => {
    const query = 'SELECT * FROM users WHERE Username = ?';
    return new Promise((res, rej) => {
        connection.query(query, [username], (error, results, fields) => {
            if(error) {
                rej(error);
            } else {
                res(JSON.parse(JSON.stringify(results)));
            }
        });
    });
};

// ADMIN
adminDeleteUserProfileQuery = (userId) => {
    const query = "DELETE FROM users WHERE Id = ?";
    return new Promise((res, rej) => {
        connection.query(query,[userId], (error, results, fields)=> {
            if(error){
                rej(error);
            } else {
                res(results)
            }
        });
    });
};


module.exports = {
    signUpQuery,
    logInUserQuery,
    adminDeleteUserProfileQuery
}