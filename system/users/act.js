const queries = require('./query');
const evnetsQueries = require('../eventi/query');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helper = require('../helper/helper');


getAllUsers = async(req, res) => {
    const userId = req.params.userId;

    const userTypes = await queries.adminGetOneUserQuery(userId);
    const checkUserType = userTypes[0].User_type;

    if(checkUserType == 'client'){
        res.status(400).json({
            message: `User with ID of ${userId}, does not have permissions to do that.`
        })
    } else {
        try {
            const users = await queries.getAllUsersQuery();
            res.status(200).json({
                users
            })
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

getUserInfoAndEvent = async(req, res) => {
    const userId = req.params.userId;

    const users = await getAllUsersQuery();
    const userExist = users.some(user => {
        return userId == user.Id
    });
    
    const events = await evnetsQueries.getAllEventsQuery();
    const eventExist = events.some(event => {
        return userId == event.User_id
    });
    // console.log(eventExist);

    if(userExist == false) {
        res.status(400).json({
            message: `User with ID of ${userId}, has not been found.`
        })
    } else if(eventExist == false) {
        res.status(400).json({
            message: `User with ID of ${userId}, does not have any events.`
        })
    } 
    else {
        try {
            const userInfoAndEvents = await queries.getUserInfoAndEventsQuery(userId);
            const events = userInfoAndEvents.map(events => {
                const eventsObj = {
                    title: events.Title,
                    shortInfo: events.Short_info,
                    host: events.Host
                }
                return eventsObj
            })
            // console.log(events[0].title);
            res.status(200).json({
                userInfo:{
                    name: userInfoAndEvents[0].Name,
                    lastName: userInfoAndEvents[0].Lastname,
                    email: userInfoAndEvents[0].Email
                },
                events
            })
            
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

getMyProfile = async(req, res) => {
    const userId = req.params.userId;

    const users = await queries.getAllUsersQuery();
    const userExist = users.some(user => {
        return userId == user.Id
    });

    if(userExist == false) {
        res.status(400).json({
            message: `User with ID of ${userId}, has not been found.`
        })
    } else {
        try {
            const myProfile = await queries.adminGetOneUserQuery(userId);
            res.status(200).json({
                myProfile
            })
        } catch (error) {
            res.status(500).send(error);
        }
    }
};


signUp = async(req, res) => {
    const userRequest = req.body;
    const firstname = req.body.Firstname;
    const lastname = req.body.Lastname;
    const username = req.body.Username;
    const email = req.body.Email;
    const companyName = req.body.Comapny_name;
    const password = req.body.Password;
    const userType = req.body.User_type;

    const emails = await queries.getAllUsersQuery();
    const emailExist = emails.some(user => {
        return email === user.Email
    });

    const usernames = await queries.getAllUsersQuery();
    const usernameExists = usernames.some(user => {
        return username === user.Username
    });

    if(firstname == "" || lastname == "" || username == "" || email == "" || password == "" || userType == ""){
        res.status(400).json({
            message: 'All fields must be filled with information.'
        })
    } else if(usernameExists){
        res.status(409).json({
            message: `Username ${username}, is already in use. Try with another one.`
        })
    } else if(username.length < 4){
        res.status(409).json({
            message: `Username ${req.body.Username}, is too short. Your username must contain at least 4 characters.`
        })
    } else if(emailExist) {
        res.status(409).json({
            message: `Email ${email}. is already in use. Try with another one.`
        })
    } else if(helper.symbols.test(email) == false) {
        return res.status(400).json({
            message: `Email ${email}, is not valid. Try with another one.`
        });
    } else if(password.length <= 8) {
        res.status(409).json({
            message: 'Your password must contain at least 6 characters.'
        })
    } else if(helper.passwordTest.test(password) == false) {
        return res.status(400).json({
            message: 'Your password must contain 1 lower case letter, 1 capital letter, 1 or more numbers and a special character as !@#$%^&*'
        })
    } 
     else {
        try {
            const passHash = bcrypt.hashSync(userRequest.Password, 10);
            await queries.signUpQuery(firstname, lastname, username, email, companyName, userType, passHash);
            
            res.status(201).json({
                message: 'User has been created!'
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }
};


logIn = async(req, res) => {
    const username = req.body.Username;
    // const email = req.body.Email;
    const password = req.body.Password;

    const usernames = await queries.getAllUsersQuery();
    const usernameExists = usernames.some(user => {
        return username === user.Username
    });

    if(username == ""){
        res.status(400).json({
            message: 'Please enter your username.'
        })
    } else if(password == ""){
        res.status(400).json({
            message: 'Please enter your password.'
        })
    } else if(!usernameExists){
        res.status(400).json({
            message: `Username ${username}, has not been found. Please try with another one.`
        })
    } else if(username.length <= 4) {
        res.status(409).json({
            message: `Username ${username}, is not valid. Your username should contain 4 or more characters.`
        })
    } else if(password.length <= 1){
        res.status(409).json({
            message: `Password ${password}, is not valid.`
        })
    } else {
        try {
            const user = await queries.logInUserQuery(username);
            const newUser = user[0];
            const matchPassword = bcrypt.compareSync(password, newUser.Password);
    
            if(matchPassword){
                jwt.sign({user: newUser}, 'secret', (err, token)=>{
                    res.json({
                        token,
                        message: 'You have been logged in.'
                    });
                })
            } 
        } catch (error) {
            res.status(500).send(error);
        }
    }
};



editMyProfile = async(req, res) => {
    const userId = req.params.userId;

    const name = req.body.Name;
    const lastname = req.body.Lastname;
    const username = req.body.Username;
    const email = req.body.Email;
    const companyName = req.body.Company_name;
    

    const users = await queries.getAllUsersQuery();
    const userExist = users.some(user => {
        return userId == user.Id
    });

    const uneditedUsername = users.filter(user => {
        if(username == "") {
            username == user.Username
        } else {
            user.Username = username
        }

        if(name == "") {
            name == user.Name
        } else {
            user.Name = name
        }

        if(email == ""){
            email == user.Email
        } else {
            user.Email = email
        }

        if(lastname == ""){
            lastName == user.Lastname
        } else {
            user.Lastname = lastname
        }
        return user;
    });

    const finalResults = uneditedUsername[0];
    console.log(finalResults.Username);

    if(userExist == false) {
        res.status(400).json({
            message: `User with ID of ${userId}, has not been found.`
        })
    } 
    else {
        try {
            await queries.editMyProfileQuery(finalResults.Name, finalResults.Lastname, finalResults.Username, finalResults.Email, companyName, userId);
    
            res.status(200).json({
                message: `User with ID of ${userId}, has been updated.`
            })
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

// ADMIN

adminDeleteUserProfile = async(req, res) => {
    const userId = req.params.userId;
    const adminId = req.params.adminId;

    const userTypes = await queries.adminGetOneUserQuery(adminId);
    const checkUserType = userTypes[0].User_type;
    console.log(checkUserType);

    const users = await getAllUsersQuery();
    const userExist = users.some(user => {
        return userId == user.Id
    });

    if(checkUserType == 'client'){
        res.status(400).json({
            message: 'You dont have permissions to do that.'
        })
    } else if (userExist == false) {
        res.status(400).json({
            message: `User with ID of ${userId}, has not been found.`
        })
    } else {
        try {
            await queries.adminDeleteUserProfileQuery(userId);
    
            res.status(200).json({
                message: `User with ID of ${userId}, has been deleted.`
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }
};


adminGetOneUser = async(req, res) => {
    const userId = req.params.userId;
    const adminId = req.params.adminId;

    const userTypes = await queries.adminGetOneUserQuery(adminId);
    const checkUserType = userTypes[0].User_type;

    const users = await getAllUsersQuery();
    const userExist = users.some(user => {
        return userId == user.Id
    });

    if(checkUserType == 'client'){
        res.status(400).json({
            message: `User with ID of ${adminId}, does not have permissions to do that.`
        })
    } else if(!userExist) {
        res.status(400).json({
            message: `User with ID of ${userId}, has not been found. Try with another one.`
        })
    } else {
        try {
            const user = await queries.adminGetOneUserQuery(userId);
            res.status(200).json({
                user
            })
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

module.exports = {
    signUp,
    logIn,
    editMyProfile,
    adminDeleteUserProfile,
    adminGetOneUser,
    getAllUsers,
    getUserInfoAndEvent,
    getMyProfile
};