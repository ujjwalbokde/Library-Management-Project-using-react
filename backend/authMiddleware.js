const jwt = require('jsonwebtoken');

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    req.user = decoded; // Attach decoded user information to request object
    next();
  });
};


const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = decoded.userId;
    req.role = decoded.role; // Ensure role is properly attached to req object
    next();
  });
};

const isAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.KEY);
    console.log(decoded.role);
    if (decoded.role !== 'admin') {
      console.log("You are not a admin");
      return res.status(403).json({ status:true,message: "Access denied" });
    }
    req.role = decoded.role; // Add decoded token to request object
    console.log("You are a admin");
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = {isAdmin,verifyToken,authenticateToken};
