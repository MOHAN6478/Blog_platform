import { Pool } from "pg";
import 'dotenv/config';


const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false
});

// Test connection
pool.connect()
  .then(() => {
    console.log(" PostgreSQL Connected Successfully");
  })
  .catch(err => {
    console.error("Database connection error:", err.message);
  });

export default pool;
