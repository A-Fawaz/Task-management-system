const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Authorization token not provided' });
  }

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, 'hellodima12$');

    // Add the authenticated user ID to the request object
    req.user = { _id: decodedToken.userId }; // Assuming userId is the field in the JWT payload containing the user ID

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = {
  authenticateUser,
};
