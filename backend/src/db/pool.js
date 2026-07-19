const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Copy backend/.env.example to backend/.env and add your Neon connection string.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon requires SSL; rejectUnauthorized false is fine for this take-home.
  ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err);
});

module.exports = pool;
