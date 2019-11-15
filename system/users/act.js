const connection = require('../../DB/database');
const queries = require('./query');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


signUp = async(req, res) => {
    const userRequest = req.body;

    if(req.body.Password.length <= 5) {
        res.status(409).json({
            success: false,
            message: 'Your password must contain at least 6 characters.'
        })
    } else if(req.body.Username.length < 4){
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
    const password = req.body.Password;

    if(username.length <= 4) {
        res.status(409).json({
            success: false,
            message: `Username ${username}, is too short`
        })
    }
    if(password.length <= 1){
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