import { Pool } from 'pg'

// Database connection pool
let pool: Pool | null = null

export function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST || '172.104.24.82',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_DATABASE || 'codex_main',
      user: process.env.DB_USERNAME || 'codex_admin',
      password: process.env.DB_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  return pool
}

export async function query<T = any>(text: string, params?: unknown[]): Promise<T[]> {
  const pool = getPool()
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res.rows as T[]
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

const db = {
  query,
  getPool,
}

export default db
