const JWTService = require('../utils/JWTtoken');
const tokenModel = require('../models/tokenModel');
const userModel = require('../models/userModel');

async function isValidToken(req, res, next) {
  try {
    let { token } = req.headers;

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized - No token provided' });
    }

    // Check if the token is in the correct format ("Bearer <token>")
    if (!token.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'Unauthorized - Invalid token format' });
    }

    token = token.substring(7); // Remove 'Bearer ' from the token

    if (token && token !== 'undefined') {
      JWTService.verifyToken(token);
      //verification token in db
      const result = await tokenModel.findOne({ token });
      console.log('result', result);
      if (result) {
        req.userId = result.userId;
        next();
      } else {
        res
          .status(400)
          .json({ status: 'failed', message: 'Token is not present in DB' });
      }
    } else {
      res
        .status(400)
        .json({ status: 'failed', message: 'Token is not present in header' });
    }
  } catch (error) {
    res.json({
      status: 'token error',
      error,
    });
  }
}

async function isAdmin(req, res, next) {
  try {
    let { token } = req.headers;
    token = token?.trim().replace(`"`, '').split(' ')?.[1]?.replace(`"`, '');
    if (token === 'undefined') throw new Error('token is undefined');
    const response = await JWTService.verifyToken(token);
    const result = await tokenModel.findOne({ token });

    const userDetails = await userModel.findById(result.userId);

    if (!response || !result || !userDetails || userDetails.role !== 'ADMIN') {
      return res.status(300).json({
        message: 'User is not Admin.Only Admin can access this route',
      });
    }

    next();
  } catch (error) {
    res.status(400).json(error);
  }
}

module.exports = {
  isValidToken,
  isAdmin,
};
