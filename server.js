/**
 * Hostinger / production entry point.
 * hPanel expects a root-level server file (server.js, app.js, or index.js).
 */
process.env.NODE_ENV ??= 'production'

await import('./server/index.js')
