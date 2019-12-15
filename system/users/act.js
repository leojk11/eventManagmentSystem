const queries = require('./query');
const evnetsQueries = require('../eventi/query');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helper = require('../helper/helper');


getAllUsers = async(req, res, next) => {
    const userId = req.params.userId;

    const users = await queries.getAllUsersQuery();
    const userExist = users.some(user => {
        return userId == user.Id
    })

    if(userExist == true){
        const userTypes = await queries.adminGetOneUserQuery(userId);
        const checkUserType = userTypes[0].User_type;
    
        if(checkUserType == 'client'){
            var error = new Error(`User with ID of ${userId}, does not have permissions to do that.`);
            error.status = 400;
            next(error);
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
    } else {
        var error = new Error(`Admin with ID of ${userId}, has not been found.`)
        error.status = 400;
        next(error);
    }
    
};

getUserInfoAndEvent = async(req, res, next) => {
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
        var error = new Error(`User with ID of ${userId}, has not been found.`);
        error.status = 400;
        next(error);
    } 
    else if(eventExist == false) {
        var error = new Error(`User with ID of ${userId}, does not have any events.`);
        error.status = 400;
        next(error);
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

getMyProfile = async(req, res, next) => {
    const userId = req.params.userId;

    const users = await queries.getAllUsersQuery();
    const userExist = users.some(user => {
        return userId == user.Id
    });

    if(userExist == false) {
        var error = new Error(`User with ID of ${userId}, has not been found.`);
        error.status = 400;
        next(error);
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


signUp = async(req, res, next) => {
    const userRequest = req.body;
    const firstname = req.body.Firstname;
    const lastname = req.body.Lastname;
    const username = req.body.Username;
    const email = req.body.Email;
    const companyName = req.body.Comapny_name;
    const password = req.body.Password;
    const userType = 'client';

    const emails = await queries.getAllUsersQuery();
    const emailExist = emails.some(user => {
        return email === user.Email
    });

    const usernames = await queries.getAllUsersQuery();
    const usernameExists = usernames.some(user => {
        return username === user.Username
    });

    if(firstname == null || lastname == null || username == null || email == null || password == null){
        var error = new Error('All fields must be filled with information.');
        error.status = 400;
        next(error);
    } 
    else if(usernameExists){
        var error = new Error(`Username ${username}, is already in use. Try with another one.`);
        error.status = 400;
        next(error);
    } 
    else if(username.length < 4){
        var error = new Error(`Username ${req.body.Username}, is not valid. Your username must contain at least 4 characters.`);
        error.status = 400;
        next(error);
    }
    else if(emailExist){
        var error = new Error(`Email ${email}. is already in use. Try with another one.`);
        error.status = 400;
        next(error);
    } 
    else if(helper.symbols.test(email) == false) {
        return res.status(400).json({
            message: `Email ${email}, is not valid. Try with another one.`
        });
    } 
    else if(password.length <= 8) {
        var error = new Error('Your password must contain at least 6 characters.');
        error.status = 400;
        next(error);
    } 
    else if(helper.passwordTest.test(password) == false) {
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


logIn = async(req, res, next) => {
    const username = req.body.Username;
    // const email = req.body.Email;
    const password = req.body.Password;

    const usernames = await queries.getAllUsersQuery();
    const usernameExists = usernames.some(user => {
        return username === user.Username
    });

    if(username == null || password == null){
        var error = new Error('Please enter your username and username.');
        error.status = 400;
        next(error);
    } 
    else if(usernameExists == false){
        var error = new Error(`Username ${username}, has not been found. Please try with another one.`);
        error.status = 400;
        next(error);
    } 
    else if(username.length <= 4) {
        var error = new Error(`Username ${username}, is not valid. Your username should contain 4 or more characters.`);
        error.status = 400;
        next(error);
    } 
    else if(password.length <= 1){
        var error = new Error(`Password ${password}, is not valid.`);
        error.status = 400;
        next(error);
    } 
    else {
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
            } else {
                var error = new Error('You have entered wrong password');
                error.status = 400;
                next(error);
            }
        } catch (error) {
            res.status(500).send(error);
            console.log(error);
        }
    }
};



editMyProfile = async(req, res, next) => {
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
        if(username == null) {
            username == user.Username
        } else {
            user.Username = username
        }

        if(name == null) {
            name == user.Name
        } else {
            user.Name = name
        }

        if(email == null){
            email == user.Email
        } else {
            user.Email = email
        }

        if(lastname == null){
            lastName == user.Lastname
        } else {
            user.Lastname = lastname
        }
        return user;
    });

    const finalResults = uneditedUsername[0];
    console.log(finalResults.Username);

    if(userExist == false) {
        var error = new Error(`User with ID of ${userId}, has not been found.`);
        error.status = 400;
        next(error);
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

adminDeleteUserProfile = async(req, res, next) => {
    const userId = req.params.userId;
    const adminId = req.params.adminId;

    const userTypes = await queries.adminGetOneUserQuery(adminId);
    const checkUserType = userTypes[0].User_type;
    console.log(checkUserType);

    const users = await getAllUsersQuery();
    const userExist = users.some(user => {
        return userId == user.Id
    });
    const adminExist = users.some(user => {
        return adminId == user.Id
    })

    if(adminExist == false){
        var error = new Error(`Admin with ID of ${adminId}, does not exist.`);
        error.status = 400;
        next(error);
    } else if (userExist == false) {
        var error = new Error(`User with ID of ${userId}, has not been found.`);
        error.status = 400;
        next(error);
    }
    else if(checkUserType == 'client'){
        var error = new Error(`You dont have permissions to do that.`);
        error.status = 400;
        next(error);
    } 
     else {
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


adminGetOneUser = async(req, res, next) => {
    const userId = req.params.userId;
    const adminId = req.params.adminId;

    const userTypes = await queries.adminGetOneUserQuery(adminId);
    const checkUserType = userTypes[0].User_type;

    const users = await getAllUsersQuery();
    const userExist = users.some(user => {
        return userId == user.Id
    });

    if(checkUserType == 'client'){
        var error = new Error(`User with ID of ${adminId}, does not have permissions to do that.`);
        error.status = 400;
        next(error);
    } 
    else if(userExist == false){
        var error = new Error(`User with ID of ${userId}, has not been found. Try with another one.`);
        error.status = 400;
        next(error);
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