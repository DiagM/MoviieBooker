const express = require("express");
const fs = require("fs");
const path = require("path");
const { generateToken, verifyToken } = require("../utils/token");

const router = express.Router();
const USERS_FILE = path.join(__dirname, "..", "users.json");

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE));

  const exists = users.find((u) => u.username === username);
  if (exists) return res.status(400).json({ message: "User already exists" });

  users.push({ username, password });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  const token = generateToken({ username });
  res.json({ token });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE));

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken({ username });
  res.json({ token });
});

router.post("/verify", (req, res) => {
  const { token } = req.body;
  try {
    const user = verifyToken(token);
    res.json({ user });
  } catch (e) {
    res.status(400).json({ message: "Invalid token" });
  }
});

module.exports = router;
