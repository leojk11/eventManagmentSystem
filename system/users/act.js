const connection = require('../../DB/database');
const queries = require('./query');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


signUp = async(req, res, next) => {
    try {
        const userRequest = req.body;
        const passHash = bcrypt.hashSync(userRequest.Password, 10);
        await queries.signUpQuery(userRequest, passHash);
        res.status(201).json({
            message: 'User has been created!'
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

logIn = async(req, res) => {
    const username = req.body.Username;
    const password = req.body.Password;

    try {
        const user = await queries.logInUserQuery(username);
        const newUser = user[0];
        const matchPassword = bcrypt.compareSync(password, newUser.Password);

        if(matchPassword){
            jwt.sign({user: newUser}, 'secret', (err, token)=>{
                res.json({
                    token,
                    message: 'You have been logged in'
                });
            })
            // res.status(200).send('logged');
        } else {
            res.status(401).send("wrong pass");
        }
    } catch (error) {
        res.status(500).status(error.message);
    }
};

editMyProfile = async(req, res) => {
    const name = req.body.Name;
    const lastname = req.body.Lastname;
    const username = req.body.Username;
    const email = req.body.Email;
    const companyName = req.body.Company_name;

    const updReqList = [name, lastname, username, email, companyName];
    const userId = req.params.userId;
    try {
        const updatedUser = await queries.editMyProfileQuery(updReqList, userId);

        res.status(200).json({
            message: `User with ID of ${userId}, has been updated.`,
            updatedUser
        })
    } catch (error) {
        res.status(500).send(error);
    }
}

// ADMIN
adminDeleteUserProfile = async(req, res) => {
    const userId = req.params.userId;
    try {
        await queries.adminDeleteUserProfileQuery(userId);

        res.status(200).json({
            message: `User with ID of ${userId}, has been deleted`
        });
    } catch (error) {
        res.status(500).send(error);
    }
}



// za test
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

getAllUsers = async(req, res) => {
    try {
        const users = await getAllUsersQuery();
        res.status(200).json({
            users
        })
       
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    signUp,
    logIn,
    editMyProfile,
    adminDeleteUserProfile,
    getAllUsers
}