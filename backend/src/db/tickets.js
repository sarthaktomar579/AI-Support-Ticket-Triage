const pool = require("./pool");

async function createTicket({
  name,
  email,
  message,
  priority = null,
  category = null,
  suggestedReply = null,
  aiStatus = "pending",
  aiError = null,
}) {
  const { rows } = await pool.query(
    `INSERT INTO tickets
      (name, email, message, priority, category, suggested_reply, ai_status, ai_error)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [name, email, message, priority, category, suggestedReply, aiStatus, aiError]
  );
  return rows[0];
}

async function findTickets({ priority, category } = {}) {
  const filters = [];
  const values = [];

  if (priority) {
    values.push(priority);
    filters.push(`priority = $${values.length}`);
  }

  if (category) {
    values.push(category);
    filters.push(`category = $${values.length}`);
  }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const { rows } = await pool.query(
    `SELECT * FROM tickets ${where} ORDER BY created_at DESC`,
    values
  );
  return rows;
}

async function findTicketById(id) {
  const { rows } = await pool.query(`SELECT * FROM tickets WHERE id = $1`, [id]);
  return rows[0] || null;
}

async function findAdminByEmail(email) {
  const { rows } = await pool.query(`SELECT * FROM admins WHERE email = $1`, [
    email,
  ]);
  return rows[0] || null;
}

module.exports = {
  createTicket,
  findTickets,
  findTicketById,
  findAdminByEmail,
};
