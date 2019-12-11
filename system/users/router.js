const express = require('express');
const actions = require('./act');
const middlewares = require('../../middlewares/middlewares');


const {verifyToken} = middlewares;

const routes = express.Router();

routes.post('/register', signUp);
routes.post('/login', logIn);
// routes.post('/owner/register-admin', actions. )

routes.put('/my-profile/:userId/edit', verifyToken, actions.editMyProfile);

routes.get('/admin/users', verifyToken, actions.getAllUsers);
routes.get('/my-profile/:userId', actions.getMyProfile);
routes.get('/admin/users/:userId', verifyToken, actions.adminGetOneUser);
routes.get('/user-and-events/:userId', actions.getUserInfoAndEvent);

routes.delete('/admin/:adminId/delete-user/:userId', verifyToken, adminDeleteUserProfile)

module.exports = routes;