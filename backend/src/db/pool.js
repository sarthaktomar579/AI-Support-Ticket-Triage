const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env and add your connection string."
  );
}

function connectionString() {
  const url = process.env.DATABASE_URL;
  if (url.includes("uselibpqcompat=")) return url;
  return url.includes("?")
    ? `${url}&uselibpqcompat=true`
    : `${url}?uselibpqcompat=true`;
}

const pool = new Pool({
  connectionString: connectionString(),
  ssl:
    process.env.DATABASE_SSL === "false"
      ? false
      : { rejectUnauthorized: false },
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err);
});

module.exports = pool;
