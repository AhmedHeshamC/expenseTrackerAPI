const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/config');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

// @desc    Register a new user
// @route   POST /api/v1/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      res.status(400); // Bad Request
      throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
      username,
      password, // Password will be hashed by the model hook
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        token: generateToken(user.id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error); // Pass error to the error handler
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Check for user by username
    const user = await User.findOne({ where: { username } });

    if (user && (await user.isValidPassword(password))) {
      res.json({
        _id: user.id,
        username: user.username,
        token: generateToken(user.id),
      });
    } else {
      res.status(401); // Unauthorized
      throw new Error('Invalid username or password');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
};
