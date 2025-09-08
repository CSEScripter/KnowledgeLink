const jwt = require('jsonwebtoken');

const authMiddleware = {
  // Verify JWT token
  protect: async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user data to request
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  },

  // Restrict to specific roles
  restrictTo: (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'You do not have permission to perform this action' });
      }
      next();
    };
  },
};

module.exports = authMiddleware;