const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const { authenticationToken, authorizeRoles } = require("./auth");

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

router.post("/sign-in", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const selectedRole = role === "admin" ? "admin" : "member";

    // Validate input length
    if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username must have at least 4 characters!" });
    }
    if (password.length < 4) {
      return res
        .status(400)
        .json({ message: "Password must have at least 4 characters!" });
    }

    let existingUser = await User.findOne({ username });
    let existingEmail = await User.findOne({ email });

    // Check for existing user and email
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists!" });
    }
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hash,
      role: selectedRole,
    });
    await newUser.save();
    return res.status(200).json({ message: "Signin successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server issue!" });
  }
});

router.post("/log-in", async (req, res) => {
  const { username, password } = req.body;
  let user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "User doesn't exist!" });
  }
  bcrypt.compare(password, user.password, (err, data) => {
    if (data) {
      const authClaims = [{ name: username }, { role: user.role }];
      const token = jwt.sign(
        { id: user._id, role: user.role, authClaims },
        JWT_SECRET,
        { expiresIn: "2d" }
      );
      res.status(200).json({
        id: user._id,
        token: token,
        role: user.role,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(404).json({ message: "Invalid Credentials!" });
    }
  });
});

router.get("/me", authenticationToken, async (req, res) => {
  res.status(200).json({ data: req.user });
});

router.get(
  "/users",
  authenticationToken,
  authorizeRoles("admin"),
  async (req, res) => {
    const users = await User.find().select("-password").sort({ username: 1 });
    res.status(200).json({ data: users });
  }
);

module.exports = router;
