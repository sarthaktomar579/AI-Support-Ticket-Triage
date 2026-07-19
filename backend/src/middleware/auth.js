const jwt = require("jsonwebtoken");

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === "change-me-to-a-long-random-string") {
    console.warn(
      "Warning: JWT_SECRET is using the default placeholder. Set a strong secret in .env."
    );
  }
  return secret || "change-me-to-a-long-random-string";
}

function signAdminToken(admin) {
  return jwt.sign(
    { sub: admin.id, email: admin.email, role: "admin" },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
  );
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (payload.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    req.admin = { id: payload.sub, email: payload.email };
    return next();
  } catch (_err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = {
  signAdminToken,
  requireAdmin,
  getJwtSecret,
};
