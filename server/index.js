import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getGateKeeperGreeting, replyToMessage } from './gatekeeper.js'
import { config } from './config.js'
import { authRouter } from './auth.js'
import { checkoutRouter, createStripeWebhookHandler } from './checkout.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SUBSCRIBERS_FILE = path.join(__dirname, 'subscribers.json')
const CONTACTS_FILE = path.join(__dirname, 'contacts.json')
const DIST_DIR = path.join(__dirname, '..', 'dist')

const app = express()

app.set('trust proxy', 1)

app.use(
  helmet({
    contentSecurityPolicy: config.isProduction
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://js.stripe.com'],
            frameSrc: ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com'],
            connectSrc: ["'self'", 'https://api.stripe.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          },
        }
      : false,
  }),
)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.corsOrigins.includes(origin)) {
        callback(null, true)
        return
      }
      callback(null, false)
    },
    credentials: true,
  }),
)

app.post(
  '/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  createStripeWebhookHandler(),
)

app.use(express.json({ limit: '32kb' }))
app.use(cookieParser())

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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const distReady = fs.existsSync(DIST_DIR)

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    env: config.nodeEnv,
    frontend: config.isProduction ? (distReady ? 'dist' : 'missing') : 'dev-proxy',
  })
})

app.use('/api/auth', authRouter)
app.use('/api/checkout', checkoutRouter)

app.post('/api/subscribe', (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase()

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }

  const subscribers = readJson(SUBSCRIBERS_FILE)

  if (subscribers.some((s) => s.email === email)) {
    return res.status(409).json({ error: 'This email is already inscribed in our ledger.' })
  }

  subscribers.push({ email, subscribedAt: new Date().toISOString() })
  writeJson(SUBSCRIBERS_FILE, subscribers)

  res.json({ message: 'Welcome to the night. Your name has been inscribed in our ledger.' })
})

app.post('/api/contact', (req, res) => {
  const name = String(req.body?.name ?? '').trim()
  const email = String(req.body?.email ?? '').trim().toLowerCase()
  const message = String(req.body?.message ?? '').trim()

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please complete all fields.' })
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }

  const contacts = readJson(CONTACTS_FILE)
  contacts.push({ name, email, message, receivedAt: new Date().toISOString() })
  writeJson(CONTACTS_FILE, contacts)

  console.log(`[contact] ${name} <${email}>`)
  res.json({ message: 'Your raven has been dispatched.' })
})

app.post('/api/chat', (req, res) => {
  const message = String(req.body?.message ?? '').trim()

  if (!message) {
    return res.status(400).json({ error: 'Speak, and Gate Keeper shall listen.' })
  }

  if (message.length > 500) {
    return res.status(400).json({ error: 'Keep your inquiry within five hundred characters, if you please.' })
  }

  const reply = replyToMessage(message)
  res.json({ reply })
})

app.get('/api/chat/greeting', (_req, res) => {
  res.json({ greeting: getGateKeeperGreeting() })
})

if (config.isProduction) {
  if (distReady) {
    app.use(express.static(DIST_DIR, { index: false }))

    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(DIST_DIR, 'index.html'))
    })
  } else {
    console.warn(
      `[startup] Production mode but ${DIST_DIR} is missing — run "npm run build" before start.`,
    )
  }
}

app.listen(config.port, config.host, () => {
  console.log(`Nocturne Atelier listening on ${config.host}:${config.port} (${config.nodeEnv})`)
  if (config.isProduction && distReady) {
    console.log(`Serving frontend from ${DIST_DIR}`)
  }
})
