const mongoose = require('mongoose');

const validator = require('validator');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    require: [false, 'Please tell your First name'],
  },
  last_name: {
    type: String,
    require: [false, 'Please tell your Last name'],
  },
  email: {
    type: String,
    require: [true, 'email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  role: { type: String, required: false, default: 'CUSTOMER' },
  password: {
    type: String,
    require: [true, 'password is required'],
    minlength: 8,
    // select: false,
  },
  gender: { type: String },
  createdAt: { type: String, default: new Date().toISOString().split('T')[0] },
});
module.exports = mongoose.model('Users', userSchema);
