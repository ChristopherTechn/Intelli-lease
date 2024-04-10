const jwt = require('jsonwebtoken');

const userMiddleware = (req, res, next) => {
  const token = req.body.token || req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Token not provided' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.decodedToken = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

module.exports = userMiddleware
