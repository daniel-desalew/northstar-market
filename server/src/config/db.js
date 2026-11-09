const fs = require('node:fs/promises')
const path = require('node:path')
const { Pool } = require('pg')

let pool

function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required. Configure server/.env with your Neon PostgreSQL connection string.')
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL })
  }
  return pool
}

async function connectDatabase() {
  const database = getPool()
  const schema = await fs.readFile(path.join(__dirname, 'schema.sql'), 'utf8')
  await database.query(schema)
  await database.query('SELECT 1')
  console.info('PostgreSQL connected.')
  return database
}

async function closeDatabase() {
  if (pool) {
    await pool.end()
    pool = undefined
  }
}

module.exports = {
  closeDatabase,
  connectDatabase,
  getPool,
  query: (...args) => getPool().query(...args),
}
