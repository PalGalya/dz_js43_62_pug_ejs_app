const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();

const JWT_SECRET = "your-secret-key-change-in-production";
const users = []; // В реальному проекті використовуйте базу даних

// Middleware для перевірки JWT
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

// Реєстрація
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (users.find((u) => u.username === username)) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: users.length + 1, username, password: hashedPassword };
    users.push(user);

    const token = jwt.sign({ id: user.id, username }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    res.cookie("user", username, { maxAge: 3600000 });

    res.json({
      message: "Registration successful",
      user: { id: user.id, username },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Вхід
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, username }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    res.cookie("user", username, { maxAge: 3600000 });

    res.json({ message: "Login successful", user: { id: user.id, username } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Вихід
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("user");
  res.json({ message: "Logout successful" });
});

// Зміна теми
router.post("/theme", (req, res) => {
  const { theme } = req.body;
  if (theme === "light" || theme === "dark") {
    res.cookie("theme", theme, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 днів
    res.json({ message: "Theme updated", theme });
  } else {
    res.status(400).json({ message: "Invalid theme" });
  }
});

// Захищений роут
router.get("/profile", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
