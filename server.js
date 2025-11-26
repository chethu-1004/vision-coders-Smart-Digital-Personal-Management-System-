const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());           // allow frontend to call backend
app.use(express.json());   // parse JSON body

// TEMP: in-memory "database"
const users = []; // in real app, use MongoDB / MySQL etc.

const JWT_SECRET = "supersecret"; // move to .env in real app

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existing = users.find(u => u.email === email);
  if (existing) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), fullName, email, password: hashed };
  users.push(user);

  res.status(201).json({ message: "Registered successfully" });
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // create token
  const token = jwt.sign(
    { id: user.id, fullName: user.fullName, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token,
    user: { id: user.id, fullName: user.fullName, email: user.email }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
