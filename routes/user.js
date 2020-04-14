var express = require('express');
var router = express.Router();
var UserController = require('../controllers/user');
const User = require('../models/user');
var passport = require('passport');
var authenticate = require('../Authentication/authenticate');

// login using passport-jwt
router.post('/login', passport.authenticate('local-login'), (req, res) => {

  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.post('/register',  UserController.createUser);

// Retrieve All users
router.get('/details', authenticate.verifyUser, UserController.findAll);

// Retrieve a single user with phoneNumber
router.get('/:_id', authenticate.verifyUser,  UserController.findOne);

// Update an user with phoneNumber
router.put('/:_id', authenticate.verifyUser,  UserController.update);

// Delete a user with phoneNumber
router.delete('/:_id', authenticate.verifyUser,  UserController.delete);


module.exports = router;
