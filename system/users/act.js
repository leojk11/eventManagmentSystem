const connection = require('../../DB/database');
const queries = require('./query');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helper = require('../helper/helper');

signUp = async(req, res) => {
    const userRequest = req.body;
    const username = req.body.Username;
    const email = req.body.Email;
    const password = req.body.Password;

    const emails = await queries.adminGetOnlyEmailsQuery();
    const emailExist = emails.some(user => {
        return email === user.Email
    });

    const usernames = await queries.adminGetOnlyUsernameQuery();
    const usernameExists = usernames.some(user => {
        return username === user.Username
    });

    if(emailExist) {
        res.status(409).json({
            success: false,
            message: `Email ${email}. is already in use. Try with another one.`
        })
    } else if(helper.symbols.test(email) == false) {
        return res.status(400).json({
            success: false,
            message: `Email ${email}, is not valid. Try with another one.`
        });
    }
    else if(usernameExists){
        res.status(409).json({
            success: false,
            message: `Username ${username}, is already in use. Try with another one.`
        })
    } else if(password.length <= 8) {
        res.status(409).json({
            success: false,
            message: 'Your password must contain at least 6 characters.'
        })
    } else if(helper.passwordTest.test(password) == false) {
        return res.status(400).json({
            success: false,
            message: 'Your password must contain 1 lower case letter, 1 capital letter, 1 or more numbers and a specia character as !@#$%^&*'
        })
    } 
    else if(username.length < 4){
        res.status(409).json({
            success: false,
            message: `Username ${req.body.Username}, is too short. Your username must contain at least 4 characters.`
        })
    } else {
        try {
            const passHash = bcrypt.hashSync(userRequest.Password, 10);
            await queries.signUpQuery(userRequest, passHash);
            
            res.status(201).json({
                message: 'User has been created!'
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

logIn = async(req, res) => {
    const username = req.body.Username;
    const email = req.body.Email;
    const password = req.body.Password;

    const usernames = await queries.adminGetOnlyUsernameQuery();
    const usernameExists = usernames.some(user => {
        return username === user.Username
    });

    if(!usernameExists){
        res.status(400).json({
            success: false,
            message: `Username ${username}, has not been found. Please try with another one.`
        })
    } else if(username.length <= 4) {
        res.status(409).json({
            success: false,
            message: `Username ${username}, is too short`
        })
    } else if(password.length <= 1){
        if(password.length <= 6) {
            res.status(409).json({
                success: false,
                message: `Password ${password}, is too short`
            })
        }
    }

    try {
        const user = await queries.logInUserQuery(username);
        const newUser = user[0];
        const matchPassword = bcrypt.compareSync(password, newUser.Password);

        if(matchPassword){
            jwt.sign({user: newUser}, 'secret', (err, token)=>{
                res.json({
                    success: true,
                    token,
                    message: 'You have been logged in'
                });
            })
        } else if(password.length > 5){
            res.status(409).json({
                success: false,
                message: 'You have entered wrong password!'
            });
        }
    } catch (error) {
        res.status(500).send(error);
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
};
adminGetOneUser = async(req, res) => {
    const userId = req.params.userId;

    //check if given id = to user id
    const users = await getAllUsersQuery();
    const userExist = users.some(user => {
        return user.id == userId
    });
    if(!userExist) {
        res.status(400).json({
            message: `User with ID of ${userId}, has not been found. Try with another one.`
        })
    }

    try {
        const user = await queries.adminGetOneUserQuery(userId);
        res.status(200).json({
            message: `User with ID ${userId}, has been found.`,
            user
        })
    } catch (error) {
        res.status(500).send(error);
    }
};



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
    adminGetOneUser,
    getAllUsers
}