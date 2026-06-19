import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, 'nocturne.db')

const db = new Database(DB_PATH)

db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    totp_secret TEXT,
    totp_enabled INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stripe_session_id TEXT NOT NULL UNIQUE,
    user_id INTEGER,
    items_json TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`)

export function getUserByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email)
}

export function getUserById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id)
}

export function createUser({ email, passwordHash, name }) {
  const createdAt = new Date().toISOString()
  const result = db
    .prepare(
      'INSERT INTO users (email, password_hash, name, created_at) VALUES (?, ?, ?, ?)',
    )
    .run(email, passwordHash, name, createdAt)
  return getUserById(result.lastInsertRowid)
}

export function updateUserTotp(id, { secret, enabled }) {
  db.prepare('UPDATE users SET totp_secret = ?, totp_enabled = ? WHERE id = ?').run(
    secret ?? null,
    enabled ? 1 : 0,
    id,
  )
  return getUserById(id)
}

export function createOrder({ stripeSessionId, userId, items, status = 'pending' }) {
  const createdAt = new Date().toISOString()
  db.prepare(
    'INSERT INTO orders (stripe_session_id, user_id, items_json, status, created_at) VALUES (?, ?, ?, ?, ?)',
  ).run(stripeSessionId, userId ?? null, JSON.stringify(items), status, createdAt)
}

export function updateOrderStatus(stripeSessionId, status) {
  db.prepare('UPDATE orders SET status = ? WHERE stripe_session_id = ?').run(
    status,
    stripeSessionId,
  )
}

export function sanitizeUser(user) {
  if (!user) return null
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    totpEnabled: Boolean(user.totp_enabled),
    createdAt: user.created_at,
  }
}

export { db, DB_PATH }
