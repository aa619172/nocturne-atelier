import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const USERS_FILE = path.join(__dirname, 'users.json')
const ORDERS_FILE = path.join(__dirname, 'orders.json')

function readJson(file, fallback = []) {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch {
    /* start fresh */
  }
  return fallback
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

function nextId(records) {
  return records.reduce((max, r) => Math.max(max, r.id ?? 0), 0) + 1
}

export function getUserByEmail(email) {
  const normalized = email.toLowerCase()
  return readJson(USERS_FILE).find((u) => u.email.toLowerCase() === normalized) ?? null
}

export function getUserById(id) {
  const numericId = Number(id)
  return readJson(USERS_FILE).find((u) => u.id === numericId) ?? null
}

export function createUser({ email, passwordHash, name }) {
  const users = readJson(USERS_FILE)
  const createdAt = new Date().toISOString()
  const user = {
    id: nextId(users),
    email,
    password_hash: passwordHash,
    name,
    totp_secret: null,
    totp_enabled: 0,
    created_at: createdAt,
  }
  users.push(user)
  writeJson(USERS_FILE, users)
  return user
}

export function updateUserTotp(id, { secret, enabled }) {
  const users = readJson(USERS_FILE)
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) return null

  users[index] = {
    ...users[index],
    totp_secret: secret ?? null,
    totp_enabled: enabled ? 1 : 0,
  }
  writeJson(USERS_FILE, users)
  return users[index]
}

export function createOrder({ stripeSessionId, userId, items, status = 'pending' }) {
  const orders = readJson(ORDERS_FILE)
  const createdAt = new Date().toISOString()
  orders.push({
    id: nextId(orders),
    stripe_session_id: stripeSessionId,
    user_id: userId ?? null,
    items_json: JSON.stringify(items),
    status,
    created_at: createdAt,
  })
  writeJson(ORDERS_FILE, orders)
}

export function updateOrderStatus(stripeSessionId, status) {
  const orders = readJson(ORDERS_FILE)
  const index = orders.findIndex((o) => o.stripe_session_id === stripeSessionId)
  if (index === -1) return

  orders[index] = { ...orders[index], status }
  writeJson(ORDERS_FILE, orders)
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
