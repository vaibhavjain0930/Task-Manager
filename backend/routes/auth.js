const jwt = require("jsonwebtoken");
const User = require("../Models/user");

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

const authenticationToken = async (req, res, next) => {
  const authToken = req.headers["authorization"];
  // Ensure token exists, and split it correctly (expecting "Bearer <token>")
  const token = authToken && authToken.split(" ")[1];
  if (!token) {
    return res.status(400).json({ message: "User is not authenticated" });
  }

  jwt.verify(token, JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Invalid token" });
    }
    try {
      const userId = user.id || req.headers.id;
      const currentUser = await User.findById(userId).select("-password");
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = currentUser;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Internal server issue!" });
    }
  });
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission" });
    }
    next();
  };
};

module.exports = { authenticationToken, authorizeRoles };
