// backend/models/user.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define User Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Create User Model
const User = mongoose.model('User', UserSchema);

module.exports = User;
