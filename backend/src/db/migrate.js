require("dotenv").config();

const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const pool = require("./pool");

async function migrate() {
  const schemaPath = path.join(__dirname, "schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf8");

  await pool.query(schemaSql);
  console.log("Schema applied.");

  const email = process.env.ADMIN_EMAIL || "admin@skygnosis.demo";
  const password = process.env.ADMIN_PASSWORD || "Admin123!";
  const passwordHash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO admins (email, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [email, passwordHash]
  );

  console.log(`Admin ready: ${email}`);
}

migrate()
  .then(async () => {
    await pool.end();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("Migration failed:", err.message);
    await pool.end().catch(() => {});
    process.exit(1);
  });
