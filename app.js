/**
 * Hostinger / production entry point (canonical).
 * hPanel auto-detect expects app.js, server.js, or index.js at repo root.
 */
process.env.NODE_ENV ??= 'production'

if (
  process.env.NODE_ENV === 'production' &&
  (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'dev-insecure-change-me-in-production')
) {
  console.warn(
    '[startup] JWT_SECRET is unset or still the dev default — set a long random value in hPanel env vars.',
  )
}

await import('./server/index.js')
