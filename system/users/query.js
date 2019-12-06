const connection = require('../../DB/database');

// get all users
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

// registering user
function signUpQuery(user, pass) {
    const query = 'INSERT INTO users(Name, Lastname, Username, Password, Email, Company_name, Date_registered, User_type) VALUES(?,?,?,?,?,?,NOW(),?)';
    return new Promise((res, rej) => {
        connection.query(query, [user.Name, user.Lastname, user.Username, pass, user.Email, user.Company_name, user.User_type],(error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};

// login user
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

// editing user profiles
editMyProfileQuery = (user, userId) => {
    console.log(user);
    const query = "UPDATE users SET Name = ?, Lastname = ?, Username = ?, Email = ?, Company_name = ? WHERE Id = ?";
    return new Promise((res, rej)=> {
        connection.query(query, [user[0], user[1], user[2], user[3], user[4], userId], (error, results, fields) => {
            if(error){
                rej(error)
            } else {
                res(results)
            }
        });
    });
};

// geting user and user's events
getUserInfoAndEventsQuery = (userId) => {
    const query = "SELECT Name, Lastname, Email, Price, Available_amount, Event_info FROM users LEFT JOIN tickets ON tickets.User_id = users.Id WHERE users.Id = ?";
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

// ADMIN
// only admin can get specific user profile
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

// only admin can get one user
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
adminGetOnlyUsernameQuery = () => {
    const query = "SELECT Username FROM users";
    return new Promise((res, rej) => {
        connection.query(query, (error, results, fields) => {
            if(error){
                rej(error)
                console.log(error);
            } else {
                res(results)
            }
        });
    });
};
adminGetOnlyEmailsQuery = () => {
    const query = "SELECT Email FROM users";
    return new Promise((res, rej) => {
        connection.query(query, (error, results, fields) => {
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
    adminGetOnlyUsernameQuery,
    adminGetOnlyEmailsQuery,
    getAllUsersQuery,
    getUserInfoAndEventsQuery
};