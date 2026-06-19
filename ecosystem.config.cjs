/** PM2 config for VPS deploy — see HOSTINGER.md */
module.exports = {
  apps: [
    {
      name: 'nocturne',
      script: 'app.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
