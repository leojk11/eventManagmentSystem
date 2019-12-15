const express = require('express');
const actions = require('./act');
const middlewares = require('../../middlewares/middlewares');

const router = express.Router();

router.post('/register', actions.signUp);
router.post('/login', actions.logIn);
// routes.post('/owner/register-admin', actions. )

router.put('/my-profile/:userId/edit', middlewares.verifyToken, actions.editMyProfile);

router.get('/admin/:userId/users', middlewares.verifyToken, actions.getAllUsers);
router.get('/my-profile/:userId', middlewares.verifyToken, actions.getMyProfile);
router.get('/admin/:adminId/users/:userId', middlewares.verifyToken, actions.adminGetOneUser);
router.get('/users-events/:userId', middlewares.verifyToken, actions.getUserInfoAndEvent);

router.delete('/admin/:adminId/delete-user/:userId', middlewares.verifyToken, actions.adminDeleteUserProfile);

module.exports = router;