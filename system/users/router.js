const express = require('express');
const actions = require('./act');
const middlewares = require('../../middlewares/middlewares');

const {signUp, logIn, getAllUsers, adminDeleteUserProfile, editMyProfile} = actions;
const {verifyToken} = middlewares;

const routes = express.Router();

routes.post('/register', signUp);
routes.post('/login', logIn);

routes.put('/my-profile/:userId/edit', verifyToken, editMyProfile);

routes.get('/admin/all-users', verifyToken, getAllUsers);

routes.delete('/admin/delete-user/:userId', verifyToken, adminDeleteUserProfile)

module.exports = routes;