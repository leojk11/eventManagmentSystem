const express = require('express');
const actions = require('./act');
const middlewares = require('../../middlewares/middlewares');

const {signUp, logIn, getAllUsers} = actions;
const {verifyToken} = middlewares;

const routes = express.Router();

routes.post('/register', signUp);
routes.post('/login', logIn);
routes.get('/users', verifyToken, getAllUsers);

module.exports = routes;