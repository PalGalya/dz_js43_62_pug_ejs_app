require('dotenv').config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-development-only";
const users = [];

function validateUserInput(username, password) {
  const errors = [];
  if (!username || username.trim().length < 3) {
    errors.push("Username must be at least 3 characters");
  }
  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }
  return errors;
}

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
}

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const validationErrors = validateUserInput(username, password);
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: "Validation errors", errors: validationErrors });
    }
    if (users.find(u => u.username === username.trim())) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: users.length + 1, username: username.trim(), password: hashedPassword };
    users.push(user);
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    res.cookie("user", user.username, { maxAge: 3600000 });
    res.json({ message: "Registration successful", user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
    const user = users.find(u => u.username === username.trim());
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    res.cookie("user", user.username, { maxAge: 3600000 });
    res.json({ message: "Login successful", user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("user");
  res.json({ message: "Logout successful" });
});

router.post("/theme", (req, res) => {
  const { theme } = req.body;
  if (theme === "light" || theme === "dark") {
    res.cookie("theme", theme, { maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.json({ message: "Theme updated", theme });
  } else {
    res.status(400).json({ message: "Invalid theme" });
  }
});

router.get("/profile", authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ 
    message: "User profile",
    user: { 
      id: user.id, 
      username: user.username,
      registeredAt: user.registeredAt || "Unknown"
    },
    tokenInfo: {
      expiresIn: "1 hour from login",
      issuedFor: req.user.username
    }
  });
});

module.exports = router;
