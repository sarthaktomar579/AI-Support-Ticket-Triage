const bcrypt = require("bcryptjs");
const { findAdminByEmail } = require("../db/tickets");
const { signAdminToken } = require("../middleware/auth");

async function login(req, res, next) {
  try {
    const email =
      typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password =
      typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const admin = await findAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const matches = await bcrypt.compare(password, admin.password_hash);
    if (!matches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signAdminToken(admin);

    return res.status(200).json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { login };
