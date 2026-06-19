import { Router } from 'express'
import bcrypt from 'bcryptjs'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import rateLimit from 'express-rate-limit'
import {
  createUser,
  getUserByEmail,
  getUserById,
  sanitizeUser,
  updateUserTotp,
} from './db.js'
import {
  attachUserIfPresent,
  clearSessionCookie,
  isValidEmail,
  requireAuth,
  setSessionCookie,
  signToken,
  validatePassword,
  verifyToken,
} from './middleware.js'

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Wait a quarter-hour and try again.' },
})

export const authRouter = Router()
authRouter.use(authLimiter)

function issueSession(res, user) {
  const token = signToken({ sub: user.id, email: user.email })
  setSessionCookie(res, token)
  return sanitizeUser(user)
}

authRouter.post('/register', async (req, res) => {
  const email = String(req.body?.email ?? '')
    .trim()
    .toLowerCase()
  const name = String(req.body?.name ?? '').trim()
  const password = String(req.body?.password ?? '')

  if (!name || name.length > 120) {
    return res.status(400).json({ error: 'Please inscribe your name upon the ledger.' })
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid sigil (email).' })
  }

  if (!validatePassword(password)) {
    return res
      .status(400)
      .json({ error: 'Your passphrase must hold at least eight characters.' })
  }

  if (getUserByEmail(email)) {
    return res.status(409).json({ error: 'This sigil is already inscribed in our ledger.' })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = createUser({ email, passwordHash, name })

  res.status(201).json({
    message: 'Welcome to the threshold. Your name has been inscribed.',
    user: issueSession(res, user),
  })
})

authRouter.post('/login', async (req, res) => {
  const email = String(req.body?.email ?? '')
    .trim()
    .toLowerCase()
  const password = String(req.body?.password ?? '')

  if (!isValidEmail(email) || !password) {
    return res.status(400).json({ error: 'Sigil and passphrase are required.' })
  }

  const user = getUserByEmail(email)
  if (!user) {
    return res.status(401).json({ error: 'Sigil or passphrase not recognized.' })
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    return res.status(401).json({ error: 'Sigil or passphrase not recognized.' })
  }

  if (user.totp_enabled) {
    const pendingToken = signToken({ sub: user.id, type: '2fa_pending' }, '5m')
    return res.json({
      requires2FA: true,
      pendingToken,
      message: 'Present the second seal from your authenticator.',
    })
  }

  res.json({
    requires2FA: false,
    message: 'The threshold opens. Welcome back.',
    user: issueSession(res, user),
  })
})

authRouter.post('/2fa/login', (req, res) => {
  const pendingToken = String(req.body?.pendingToken ?? '')
  const token = String(req.body?.token ?? '').replace(/\s/g, '')

  if (!pendingToken || !token) {
    return res.status(400).json({ error: 'Pending session and authenticator code are required.' })
  }

  let decoded
  try {
    decoded = verifyToken(pendingToken)
  } catch {
    return res.status(401).json({ error: 'Your pending session has expired. Sign in again.' })
  }

  if (decoded.type !== '2fa_pending') {
    return res.status(400).json({ error: 'Invalid pending session.' })
  }

  const user = getUserById(decoded.sub)
  if (!user?.totp_enabled || !user.totp_secret) {
    return res.status(400).json({ error: 'Two-factor authentication is not enabled.' })
  }

  const verified = speakeasy.totp.verify({
    secret: user.totp_secret,
    encoding: 'base32',
    token,
    window: 1,
  })

  if (!verified) {
    return res.status(401).json({ error: 'The second seal was not recognized.' })
  }

  res.json({
    message: 'Both seals verified. Welcome back.',
    user: issueSession(res, user),
  })
})

authRouter.post('/2fa/setup', requireAuth, async (req, res) => {
  if (req.user.totp_enabled) {
    return res.status(400).json({ error: 'Two-factor authentication is already bound.' })
  }

  const secret = speakeasy.generateSecret({
    name: `Nocturne Atelier (${req.user.email})`,
    issuer: 'Nocturne Atelier',
    length: 32,
  })

  updateUserTotp(req.user.id, { secret: secret.base32, enabled: false })

  const qrDataUrl = await QRCode.toDataURL(secret.otpauth_url)

  res.json({
    secret: secret.base32,
    qrDataUrl,
    message: 'Scan this sigil with your authenticator, then confirm with a code.',
  })
})

authRouter.post('/2fa/verify', requireAuth, (req, res) => {
  const token = String(req.body?.token ?? '').replace(/\s/g, '')

  if (!token) {
    return res.status(400).json({ error: 'Enter the code from your authenticator.' })
  }

  if (req.user.totp_enabled) {
    return res.status(400).json({ error: 'Two-factor authentication is already bound.' })
  }

  if (!req.user.totp_secret) {
    return res.status(400).json({ error: 'Begin setup before verifying.' })
  }

  const verified = speakeasy.totp.verify({
    secret: req.user.totp_secret,
    encoding: 'base32',
    token,
    window: 1,
  })

  if (!verified) {
    return res.status(401).json({ error: 'The code was not recognized. Try again.' })
  }

  const user = updateUserTotp(req.user.id, { secret: req.user.totp_secret, enabled: true })

  res.json({
    message: 'The second seal is bound. Your account is warded.',
    user: sanitizeUser(user),
  })
})

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: attachUserIfPresent(req, res) })
})

authRouter.post('/logout', (_req, res) => {
  clearSessionCookie(res)
  res.json({ message: 'You have departed the threshold.' })
})
