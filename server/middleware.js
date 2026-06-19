import jwt from 'jsonwebtoken'
import { config } from './config.js'
import { getUserById, sanitizeUser } from './db.js'

export function signToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, config.jwtSecret, { expiresIn })
}

export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret)
}

export function setSessionCookie(res, token) {
  res.cookie(config.cookieName, token, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  })
}

export function clearSessionCookie(res) {
  res.clearCookie(config.cookieName, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'lax',
    path: '/',
  })
}

export function requireAuth(req, res, next) {
  const token = req.cookies?.[config.cookieName]
  if (!token) {
    return res.status(401).json({ error: 'You must cross the threshold before entering.' })
  }

  try {
    const decoded = verifyToken(token)
    if (decoded.type === '2fa_pending') {
      return res.status(401).json({ error: 'Two-factor verification is required.' })
    }
    const user = getUserById(decoded.sub)
    if (!user) {
      return res.status(401).json({ error: 'Session expired. Please sign in again.' })
    }
    req.user = user
    next()
  } catch {
    return res.status(401).json({ error: 'Session expired. Please sign in again.' })
  }
}

export function optionalAuth(req, _res, next) {
  const token = req.cookies?.[config.cookieName]
  if (!token) {
    req.user = null
    return next()
  }

  try {
    const decoded = verifyToken(token)
    if (decoded.type === '2fa_pending') {
      req.user = null
      return next()
    }
    req.user = getUserById(decoded.sub) ?? null
  } catch {
    req.user = null
  }
  next()
}

export function attachUserIfPresent(req, res) {
  if (!req.user) return null
  return sanitizeUser(req.user)
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePassword(password) {
  return typeof password === 'string' && password.length >= 8
}
