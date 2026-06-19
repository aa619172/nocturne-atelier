import { Router } from 'express'
import Stripe from 'stripe'
import rateLimit from 'express-rate-limit'
import { config } from './config.js'
import { createOrder, updateOrderStatus } from './db.js'
import { getMerchItem } from './merch.js'
import { optionalAuth } from './middleware.js'

const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many checkout attempts. Wait a quarter-hour.' },
})

function getStripe() {
  if (!config.stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(config.stripeSecretKey)
}

export const checkoutRouter = Router()
checkoutRouter.use(checkoutLimiter)

checkoutRouter.post('/create-session', optionalAuth, async (req, res) => {
  const itemId = String(req.body?.itemId ?? '').trim()
  const quantity = Math.min(Math.max(Number(req.body?.quantity ?? 1), 1), 10)

  if (!itemId) {
    return res.status(400).json({ error: 'Select a relic from the Reliquary.' })
  }

  const item = getMerchItem(itemId)
  if (!item) {
    return res.status(404).json({ error: 'That relic is not in our catalogue.' })
  }

  if (!config.stripeSecretKey) {
    return res.status(503).json({
      error: 'Checkout is not yet configured. The house awaits its payment sigils.',
    })
  }

  try {
    const stripe = getStripe()
    const baseUrl = config.siteUrl.replace(/\/$/, '')

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity,
          price_data: {
            currency: 'usd',
            unit_amount: item.priceCents,
            product_data: {
              name: item.title,
              description: item.description,
            },
          },
        },
      ],
      success_url: `${baseUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}#reliquary`,
      cancel_url: `${baseUrl}/?checkout=cancelled#reliquary`,
      metadata: {
        itemId,
        userId: req.user?.id ? String(req.user.id) : '',
      },
    })

    createOrder({
      stripeSessionId: session.id,
      userId: req.user?.id ?? null,
      items: [{ itemId, title: item.title, quantity, priceCents: item.priceCents }],
      status: 'pending',
    })

    res.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('[checkout]', err.message)
    res.status(500).json({ error: 'Could not open the secure ledger. Try again shortly.' })
  }
})

export function createStripeWebhookHandler() {
  return async (req, res) => {
    if (!config.stripeSecretKey || !config.stripeWebhookSecret) {
      return res.status(503).send('Stripe webhooks not configured')
    }

    const stripe = getStripe()
    const signature = req.headers['stripe-signature']

    let event
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, config.stripeWebhookSecret)
    } catch (err) {
      console.error('[stripe webhook]', err.message)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      updateOrderStatus(session.id, 'paid')
      console.log(`[order] paid ${session.id}`)
    } else if (event.type === 'checkout.session.expired') {
      updateOrderStatus(event.data.object.id, 'expired')
    }

    res.json({ received: true })
  }
}
