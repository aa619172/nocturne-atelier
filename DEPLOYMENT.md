# Deploying Nocturne Atelier

Production stack: Vite-built static frontend (`dist/`) plus Express API on port 3001 (or `PORT`). The API serves `dist/` when `NODE_ENV=production`.

Domain: **https://nocturneatelier.net**

---

## 1. Connect Git (GitHub or GitLab)

The repo is initialized locally but has **no remote yet**. Connect your Git account:

```bash
cd C:\Users\User\Projects\nocturne-atelier

# First commit (if not done)
git add .
git commit -m "Add auth, Stripe checkout, and deployment setup"

# GitHub — create repo at github.com/new, then:
git remote add origin https://github.com/YOUR_USER/nocturne-atelier.git
git branch -M main
git push -u origin main

# GitLab — create project, then:
git remote add origin https://gitlab.com/YOUR_USER/nocturne-atelier.git
git push -u origin main
```

Never commit `.env` — only `.env.example`. Secrets live on Hostinger (or GitHub Actions secrets for CI).

---

## 2. Hostinger deployment options

### Option A — Hostinger Node.js Web App (recommended)

Best fit for this project: one Node process serves API + built frontend.

1. In **hPanel → Websites → Manage → Advanced → Node.js**, create a Node.js app.
2. Connect the Git repository (GitHub/GitLab integration) or upload via SSH.
3. Set:
   - **Build command:** `npm ci && npm run build`
   - **Start command:** `npm run start`
   - **Node version:** 20 LTS or newer
4. Add environment variables (see section 4).
5. Point **nocturneatelier.net** to this app; enable SSL in hPanel.

### Option B — VPS (Hostinger KVM)

Full control for SQLite, webhooks, and custom nginx:

```bash
ssh user@your-vps-ip
git clone https://github.com/YOUR_USER/nocturne-atelier.git
cd nocturne-atelier
cp .env.example .env
# Edit .env with production values
npm ci && npm run build
```

Use **PM2** or systemd:

```bash
npm install -g pm2
pm2 start npm --name nocturne -- run start
pm2 save && pm2 startup
```

Configure nginx reverse proxy + Let's Encrypt for HTTPS on port 443 → `localhost:3001`.

### Option C — Static frontend + API split

If Hostinger only allows static hosting for the site root:

1. Build locally or in CI: `npm run build`
2. Upload `dist/` to public_html via FTP or Hostinger File Manager.
3. Run the API on a Node-enabled subdomain (e.g. `api.nocturneatelier.net`) with the same repo and `npm run start`.
4. Set `SITE_URL=https://nocturneatelier.net` and add the frontend origin to CORS (already includes production domain).

Update Vite proxy is dev-only; in production the single-server setup avoids CORS issues when both are served from one origin.

---

## 3. Build and run locally (production smoke test)

```bash
cp .env.example .env
# Fill JWT_SECRET and Stripe test keys

npm ci
npm run build
npm run start
```

Open `http://localhost:3001` — API health: `GET /api/health`.

Development remains: `npm run dev:all` (Vite :5173 + API :3001 with proxy).

---

## 4. Environment variables on Hostinger

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `production` |
| `PORT` | Usually set by Hostinger | App listen port |
| `SITE_URL` | Yes | `https://nocturneatelier.net` |
| `JWT_SECRET` | Yes | Long random string (session signing) |
| `STRIPE_SECRET_KEY` | Yes for checkout | `sk_live_...` or `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Yes for order confirmation | From Stripe webhook endpoint |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Optional at build | `pk_test_...` / `pk_live_...` (build-time if using Stripe.js later) |

Generate JWT secret (PowerShell):

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

---

## 5. Stripe setup

1. Create account at [stripe.com](https://stripe.com).
2. **Developers → API keys:** copy test `sk_test_...` into `STRIPE_SECRET_KEY`.
3. **Developers → Webhooks → Add endpoint:**
   - URL: `https://nocturneatelier.net/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `checkout.session.expired`
   - Copy signing secret → `STRIPE_WEBHOOK_SECRET`
4. Test checkout from The Reliquary → **Acquire** (redirects to Stripe Checkout).
5. For local webhook testing: `stripe listen --forward-to localhost:3001/api/webhooks/stripe`

Switch to live keys when ready for real sales.

---

## 6. GitHub Actions deploy template

See `.github/workflows/deploy.yml`. Fill repository secrets:

- `HOSTINGER_SSH_HOST`, `HOSTINGER_SSH_USER`, `HOSTINGER_SSH_KEY` (VPS git-pull deploy), **or**
- `HOSTINGER_FTP_HOST`, `HOSTINGER_FTP_USER`, `HOSTINGER_FTP_PASSWORD` (FTP upload)

The workflow is a template — enable and customize for your Hostinger plan.

---

## 7. Post-deploy checklist

- [ ] HTTPS enabled; `SITE_URL` uses `https://`
- [ ] `JWT_SECRET` is unique and not the example value
- [ ] Stripe webhook delivers 200 from production URL
- [ ] Sign up / sign in / 2FA bind flow works on live site
- [ ] Test Acquire → Stripe Checkout → success redirect
- [ ] `server/nocturne.db` persists (VPS/Node app with writable disk)

---

## Blockers requiring your credentials

These steps cannot be completed without your accounts:

1. **Git remote** — GitHub/GitLab username and repo creation
2. **Hostinger** — hPanel login, Node.js app or VPS SSH
3. **Stripe** — Dashboard API keys and webhook signing secret
4. **DNS** — Point `nocturneatelier.net` A/CNAME records to Hostinger

After credentials are in place, follow sections 1–5 above.
