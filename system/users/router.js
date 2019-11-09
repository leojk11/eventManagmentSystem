const express = require('express');
const actions = require('./act');

const routes = express.Router();

routes.get('/users', actions.getAllUsers);

module.exports = routes;