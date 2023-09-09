const express = require('express');

const app = express();

const middleware = require('../middleware/middleware');

const {
  userSignup,
  userSignin,
  userSignout,
  getUserDetails,
} = require('../controllers/auth.controller');

app.post('/signin', userSignin);
app.post('/signup', userSignup);
app.get('/logout', userSignout);
app.get('/details', middleware.isValidToken, getUserDetails);

module.exports = app;
