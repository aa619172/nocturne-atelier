/**
 * Hostinger / production entry point (canonical).
 * hPanel auto-detect expects app.js, server.js, or index.js at repo root.
 */
process.env.NODE_ENV ??= 'production'

await import('./server/index.js')
