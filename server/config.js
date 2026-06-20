const siteUrl = process.env.SITE_URL ?? 'http://localhost:5173'

export const config = {
  host: process.env.HOST ?? '0.0.0.0',
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProduction: process.env.NODE_ENV === 'production',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-insecure-change-me-in-production',
  cookieName: 'nocturne_session',
  siteUrl,
  corsOrigins: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3001',
    'https://nocturneatelier.net',
    'https://www.nocturneatelier.net',
    ...(siteUrl.startsWith('http') ? [siteUrl.replace(/\/$/, '')] : []),
  ],
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',
}
