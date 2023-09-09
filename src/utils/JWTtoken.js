const jwt = require('jsonwebtoken');
const tokenModel = require('../models/tokenModel');

const { SECRET_KEY } = process.env;

function generateToken(payload) {
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '604800s' });
  return token;
}

async function verifyToken(token) {
  try {
    const data = jwt.verify(token, SECRET_KEY);
    // console.log(data)
    if (!data) {
      await tokenModel.findOneAndDelete({ token });
    }
    return data;
  } catch (error) {
    console.log('token verification failed', error);
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
