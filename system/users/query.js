const connection = require('../../DB/database');

getAllUsersQuery = () => {
    const query = "SELECT * FROM users";
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results)
            }
          });
    });
};

signUpQuery = (firstname, lastname, username, email, companyName, userType, pass) => {
    const query = 'INSERT INTO users(Name, Lastname, Username, Password, Email, Company_name, Date_registered, User_type) VALUES(?,?,?,?,?,?,NOW(),?)';
    return new Promise((res, rej) => {
        connection.query(query, [firstname, lastname, username, pass, email, companyName, userType],(error, results, fields) => {
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

editMyProfileQuery = (name, lastname, username, email, companyName, userId) => {
    // console.log(user);
    const query = "UPDATE users SET Name = ?, Lastname = ?, Username = ?, Email = ?, Company_name = ? WHERE Id = ?";
    return new Promise((res, rej)=> {
        connection.query(query, [name, lastname, username, email, companyName, userId], (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};

getUserInfoAndEventsQuery = (userId) => {
    const query = "SELECT Name, Lastname, Email, Title, Short_info FROM users LEFT JOIN events ON events.User_id = users.Id WHERE users.Id = ?";
    return new Promise((res, rej) => {
        connection.query(query, [userId], (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};

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

adminGetOneUserQuery = (userId) => {
    const query = "SELECT * FROM users WHERE Id = ?";
    return new Promise((res,rej) => {
        connection.query(query, userId, (error, results, fiels) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};



module.exports = {
    signUpQuery,
    logInUserQuery,
    editMyProfileQuery,
    adminDeleteUserProfileQuery,
    adminGetOneUserQuery,
    getAllUsersQuery,
    getUserInfoAndEventsQuery
};