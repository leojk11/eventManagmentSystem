const express = require('express');
const actions = require('./act');
const middlewares = require('../../middlewares/middlewares');


const {verifyToken} = middlewares;

const routes = express.Router();

routes.post('/register', signUp);
routes.post('/login', logIn);

routes.put('/my-profile/:userId/edit', verifyToken, actions.editMyProfile);

routes.get('/admin/all-users', verifyToken, actions.getAllUsers);
routes.get('/admin/all-users/:userId', verifyToken, actions.adminGetOneUser);
routes.get('/user-and-events/:userId', actions.getUserInfoAndEvent);

routes.delete('/admin/delete-user/:userId', verifyToken, adminDeleteUserProfile)

module.exports = routes;