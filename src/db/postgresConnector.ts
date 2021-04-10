import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.psqlUser,
  host: process.env.psqlHost,
  database: process.env.psqlName,
  password: process.env.psqlPass,
  port: parseInt(process.env.psqlPort!),
});

export default pool;
