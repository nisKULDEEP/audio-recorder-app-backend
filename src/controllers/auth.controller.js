const userModel = require('../models/userModel');
const tokenModel = require('../models/tokenModel');
const { generateToken, verifyToken } = require('../utils/JWTtoken');
const encryptDecrypt = require('../utils/encrypt-decrypt.js');

const userSignup = async (req, res) => {
  try {
    const userDetail = req.body;
    const isPresent = await userModel.findOne({ email: userDetail.email });

    if (isPresent) {
      return res.status(400).json({
        status: 'signup failed',
        message: 'already signup, please login',
      });
    }
    const encryptPassword = encryptDecrypt.encryptPassword(userDetail.password);
    userDetail.password = encryptPassword;
    userDetail.passwordConfirm = undefined;
    const response = await userModel.create(userDetail);

    //Generate JWT token and send back to frontend
    const JWTtoken = generateToken(userDetail);
    //Insert token in DB
    await tokenModel.create({ userId: response._id, token: JWTtoken });

    res.json({
      status: 'success',
      token: JWTtoken,
      userDetail: response,
    });
  } catch (error) {
    res.json({
      status: 'error',
      message: 'token generation failed',
      error,
    });
  }
};

const userSignin = async (req, res, next) => {
  console.log('USER  SIGNIN');
  try {
    //login with email and password
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'failed',
        message: 'login or password is not correct',
      });
    }

    //Validate email and password
    const userDetail = await userModel.findOne({ email });

    const isValidPassword = encryptDecrypt.decryptPassword(
      password,
      userDetail.password
    );

    if (isValidPassword) {
      const userData = {
        email: req.body.email,
      };

      //Generate JWT token and send back to frontend
      const JWTtoken = generateToken(userData);
      //Insert token in DB
      await tokenModel.create({ userId: userDetail._id, token: JWTtoken });

      delete userDetail.password;
      res.status(200).json({
        status: 'success',
        token: JWTtoken,
        userDetail,
      });
    } else {
      res.json({ message: 'password is not valid' });
    }
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: 'signup first',
    });
  }
};

const userSignout = async (req, res, next) => {
  //remove token from DB
  try {
    let { token } = req.headers;
    token = token.split(' ')[1];
    await tokenModel.deleteOne({ token });
    res
      .status(200)
      .json({ status: 'Success', message: 'Token deleted successfully' });
  } catch (error) {
    res.json({
      status: 'failed',
    });
  }
};

const getUserDetails = async (req, res, next) => {
  console.log('GET USER DETAILS');
  try {
    console.log('token: ' + req.userId);

    const userData = await userModel.findOne({ _id: req.userId });
    res.status(200).json({
      status: 'success',
      userDetail: userData,
    });
  } catch (error) {
    res.json({
      status: 'failed',
    });
  }
};

module.exports = {
  userSignup,
  userSignin,
  userSignout,
  getUserDetails,
};
