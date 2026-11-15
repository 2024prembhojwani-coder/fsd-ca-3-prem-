const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { validateAuth } = require("../middleware/validate");

const router = express.Router();

// POST /api/auth/register
router.post("/register", validateAuth, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (db.users.some((u) => u.username === username))
      return res.status(409).json({ error: "Username already exists" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = { id: db.nextUserId++, username, passwordHash };
    db.users.push(user);
    res.status(201).json({ id: user.id, username });
  } catch (err) { next(err); }
});

// POST /api/auth/login
router.post("/login", validateAuth, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = db.users.find((u) => u.username === username);
    const ok = user && (await bcrypt.compare(password, user.passwordHash));
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });
    res.json({ token });
  } catch (err) { next(err); }
});

// GET /api/auth/profile  (protected)
router.get("/profile", require("../middleware/auth"), (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

module.exports = router;
