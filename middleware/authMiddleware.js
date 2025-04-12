const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models'); // Assuming models/index.js exports models

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret);

      // Get user from the token (excluding password)
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
      });

      if (!req.user) {
         return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Authentication error:', error.message);
       if (error.name === 'JsonWebTokenError') {
           return res.status(401).json({ message: 'Not authorized, token failed' });
       }
       if (error.name === 'TokenExpiredError') {
           return res.status(401).json({ message: 'Not authorized, token expired' });
       }
      res.status(401).json({ message: 'Not authorized' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
