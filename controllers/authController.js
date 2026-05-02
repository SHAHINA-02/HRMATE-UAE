const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const supabase = require("../config/db");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const { data: existing } = await supabase.from("users").select("id").eq("email", email).single();
    if (existing) return res.status(400).json({ error: "Email already registered" });
    const hashedPassword = await bcrypt.hash(password, 12);
    const { data: user, error } = await supabase.from("users").insert([{ name, email, password: hashedPassword, role: role || "employee" }]).select().single();
    if (error) return res.status(400).json({ error: error.message });
    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single();
    if (error || !user) return res.status(400).json({ error: "Invalid email or password" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });
    if (!user.is_active) return res.status(403).json({ error: "Account deactivated" });
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const { data: user, error } = await supabase.from("users").select("id, name, email, role, is_active, created_at").eq("id", req.user.id).single();
    if (error) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { data: user } = await supabase.from("users").select("*").eq("id", req.user.id).single();
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await supabase.from("users").update({ password: hashedPassword }).eq("id", req.user.id);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, getMe, updatePassword };