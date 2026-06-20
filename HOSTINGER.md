# Hostinger setup for Nocturne Atelier

Domain: **nocturneatelier.net**  
GitHub: **https://github.com/aa619172/nocturne-atelier**

This app is a single Node process: Express API + Vite-built frontend (`npm run build` then `npm run start`). See [DEPLOYMENT.md](./DEPLOYMENT.md) for Stripe, env vars, and post-deploy checks.

**Security:** Never paste your Hostinger access code, SSH password, or FTP password into chat, git, or repo files. Enter credentials only in hPanel, an SSH terminal, or GitHub Actions secrets.

---

## Hostinger configuration checklist

Use these **exact** values in hPanel → **Websites** → your Node.js Web App → **Manage** → **Settings and redeploy**. They match `.hostinger/deploy.json`, `package.json` → `hostinger`, and root entry `app.js`.

| hPanel setting | Value |
|----------------|-------|
| **Repository** | `https://github.com/aa619172/nocturne-atelier` |
| **Branch** | `main` |
| **Framework preset** | **Express.js** or **Other** (not Vite, not React) |
| **Application root** | `/` |
| **Entry file** | `app.js` |
| **Output directory** | `dist` |
| **Node.js version** | `20` (matches `.nvmrc`) |
| **Package manager** | `npm` |
| **Install command** | `npm ci --include=dev` |
| **Build command** | `npm run build` |
| **Start command** | `npm run start` |

**Environment variables** (hPanel → **Environment variables** — never commit to git):

| Variable | Production value |
|----------|------------------|
| `NODE_ENV` | `production` |
| `PORT` | Leave unset (Hostinger sets `PORT`; app default is `3000`) |
| `HOST` | Optional — default `0.0.0.0` |
| `SITE_URL` | `https://nocturneatelier.net` |
| `JWT_SECRET` | Long random string (required) |
| `STRIPE_SECRET_KEY` | Stripe live secret key |
| `STRIPE_WEBHOOK_SECRET` | From webhook `https://nocturneatelier.net/api/webhooks/stripe` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Optional — Stripe publishable key |

**After deploy, verify:**

1. Build log commit SHA is **`8c4b7c1` or newer** (no `better-sqlite3` in install step).
2. `https://nocturneatelier.net/api/health` → `{"ok":true,"env":"production","frontend":"dist"}`.
3. `https://nocturneatelier.net` → Nocturne Atelier storefront (not WordPress).

**If deploy fails or shows stale errors:** enable **Clear build cache and redeploy**, confirm framework is **Express.js** / **Other** (not Vite), and that GitHub `main` has `app.js` at repo root.

**Domain:** **Websites** → **Manage** → **Domains** → connect **nocturneatelier.net** as primary → **SSL** (Let's Encrypt).

---

## Domain purchased at Hostinger (nocturneatelier.net)

If Hostinger shows **"Domain isn't connected to your website"** and you bought **nocturneatelier.net** at Hostinger, you usually **do not** need to change nameservers or A records at another registrar. DNS is already on Hostinger. The domain is just **not assigned** to a website or Node.js app yet.

Follow these clicks in order:

1. Sign in at [hpanel.hostinger.com](https://hpanel.hostinger.com).
2. Left menu → **Websites**.
3. **Do you see a website?** If the list is empty → **Add Website** → **Node.js Web App** (or your Node-enabled plan).
4. Open the site → **Manage** → connect **GitHub** → repo `aa619172/nocturne-atelier`, branch `main`.
5. In the Node.js app settings, set:

   | Setting | Value |
   |---------|--------|
   | Framework | **Express.js** or **Other** |
   | Application root | `/` |
   | Entry file | `app.js` |
   | Output directory | `dist` |
   | Install | `npm ci --include=dev` |
   | Build | `npm run build` |
   | Start | `npm run start` |
   | Node version | `20` |

6. **Websites** → your site → **Manage** → **Domains** → **Connect domain** → select **nocturneatelier.net** (it should appear in your account).
7. Set **nocturneatelier.net** as the **Primary domain**.
8. **Websites** → **Manage** → **Advanced** → **Node.js** → your app → **Domains** → attach **nocturneatelier.net** if it is not listed there yet.
9. **Security** → **SSL** → enable **Let's Encrypt** for **nocturneatelier.net** (often auto-activates once the domain is connected; retry if status is Pending).
10. Node.js app → **Environment variables** — set `NODE_ENV`, `SITE_URL`, `JWT_SECRET`, Stripe keys, etc. (see [Environment variables](#environment-variables-all-scenarios)). Never commit secrets to git.

**Verify:** After the app deploys, open `https://nocturneatelier.net` and `https://nocturneatelier.net/api/health` (should return `{"ok":true,...}`).

If the banner persists after these steps, see [Domain isn't connected (troubleshooting)](#domain-isnt-connected-troubleshooting) — usually the site was never created, the domain is not primary, or the Node app Domains list is missing the custom domain.

If you see a **WordPress "Hello world!"** page (often **Astra** theme) instead of Nocturne Atelier, see [WordPress showing instead of your site](#wordpress-showing-instead-of-your-site).

---

## WordPress showing instead of your site

**Symptom:** `https://nocturneatelier.net` shows a default WordPress page ("Hello world!", Astra theme, wp-admin login) instead of the Nocturne Atelier React storefront and API.

### Why this happens

When Hostinger creates a website for a new domain, it often **auto-installs WordPress** on shared hosting. Your custom **Node.js Web App** (Vite + Express) was either **never deployed** or **nocturneatelier.net is still assigned to the WordPress website**, not to the Node app.

WordPress and a Node.js Web App are **separate hosting types** on Hostinger. They cannot share the same site slot — only **one primary application** can answer on `nocturneatelier.net`.

**Before you change anything in hPanel:** push your latest code to GitHub (`git push origin main`). Hostinger pulls from GitHub, not your PC. Confirm on GitHub that repo `aa619172/nocturne-atelier` on branch `main` has `app.js`, `package.json`, and `package-lock.json` at the repo root.

### What you should NOT do

- **Do not** upload the React `dist/` folder into WordPress (Media Library, themes, or plugins). That only serves static HTML — no Express API, auth, checkout, or Stripe webhooks.
- **Do not** install a "Node.js plugin" inside WordPress to run this app — it will not work for this stack.
- **Do not** expect FTP uploads to `public_html` to replace WordPress with a working full-stack app — you need a **Node.js Web App** or **VPS** (see [Scenario 2](#scenario-2--hpanel-nodejs-web-app-business--cloud) or [Scenario 1](#scenario-1--vps-kvm-via-ssh-access-code)).

---

### Option A (recommended): Replace WordPress with the Node.js app

Use this when you want **nocturneatelier.net** to show Nocturne Atelier only (no WordPress blog on the main domain).

#### Step 1 — Identify the WordPress website

1. Sign in at [hpanel.hostinger.com](https://hpanel.hostinger.com).
2. Left sidebar → **Websites**.
3. Find the site whose **Primary domain** is **nocturneatelier.net** (or the only site listed if you have one website).
4. Open it → **Manage**. If you see **WordPress**, **WordPress admin**, **Edit website**, or an **Astra** / **Hello world!** preview, that is the WordPress site currently serving your domain.

#### Step 2 — Remove or detach WordPress from the main domain

Hostinger does not always let you "switch" WordPress to Node.js on the same website record. Pick **one** path:

**Path A — Delete the WordPress website (simplest if you do not need WordPress)**

1. **Websites** → select the WordPress site → **Manage**.
2. Scroll to **Danger zone** (or **Website settings** → **Delete website**).
3. Click **Delete website** → confirm. This removes WordPress files and frees the domain for a new app.
4. If **nocturneatelier.net** still appears attached to a deleted site, wait a minute and refresh **Websites**.

**Path B — Keep the website slot but stop using WordPress on the main domain**

Some plans show **Change application** or let you add a **Node.js Web App** as a second website:

1. **Websites** → **Add Website** → **Node.js Web App** (or **Create website** → **Node.js**).
2. Leave the old WordPress site alone for now; you will point the domain to the new Node app in Step 4.
3. If Hostinger only allows one website on your plan, use **Path A** (delete WordPress) or upgrade the plan.

**Path C — Change primary domain on WordPress (free the apex domain)**

If you must keep WordPress temporarily but need **nocturneatelier.net** for Node:

1. **Websites** → WordPress site → **Manage** → **Domains**.
2. Remove **nocturneatelier.net** as primary (or change primary to a temporary `*.hostingersite.com` hostname).
3. Proceed with Step 3 to create the Node app and assign **nocturneatelier.net** there.

#### Step 3 — Create and deploy the Node.js Web App

1. **Websites** → **Add Website** → **Node.js Web App** (skip if you already have an empty Node app from Path B).
2. Open the new site → **Manage**.
3. **Connect GitHub** (or **Deployments** → **Connect repository**) → authorize Hostinger → select **`aa619172/nocturne-atelier`**, branch **`main`**.
4. Before the first deploy, open **Settings and redeploy** (gear icon) and set:

   | Setting | Value |
   |---------|--------|
   | Framework preset | **Express.js** or **Other** (not Vite, not React) |
   | Application root | `/` |
   | Entry file | `app.js` |
   | Output directory | `dist` |
   | Node.js version | `20` |
   | Package manager | `npm` |
   | Install command | `npm ci --include=dev` |
   | Build command | `npm run build` |
   | Start command | `npm run start` |

5. Click **Save** → **Deploy** (or **Redeploy**). Wait until the build log shows success.
6. **Environment variables** (same Node app screen or **Advanced** → **Environment variables**): set `NODE_ENV=production`, `SITE_URL=https://nocturneatelier.net`, `JWT_SECRET`, Stripe keys, etc. (see [Environment variables](#environment-variables-all-scenarios)).

If deploy fails with "Unsupported framework", see [Fix: "Unsupported framework or invalid project structure"](#fix-unsupported-framework-or-invalid-project-structure) and confirm **`git push origin main`** was done first.

#### Step 4 — Assign nocturneatelier.net to the Node app (not WordPress)

1. **Websites** → your **Node.js Web App** → **Manage** → **Domains**.
2. Click **Connect domain** or **Add domain** → select **nocturneatelier.net**.
3. Set **nocturneatelier.net** as **Primary domain**.
4. **Websites** → **Manage** → **Advanced** → **Node.js** → your app → **Domains** → confirm **nocturneatelier.net** is listed (add it here if missing).
5. **Security** → **SSL** → enable **Let's Encrypt** for **nocturneatelier.net** (retry if Pending after DNS updates).

#### Step 5 — Verify (required)

1. Open **`https://nocturneatelier.net`** — you should see the **Nocturne Atelier** storefront (dark theme, products), **not** "Hello world!" or WordPress.
2. Open **`https://nocturneatelier.net/api/health`** — should return JSON like `{"ok":true,...}`.
3. If WordPress still appears: hard-refresh the browser (Ctrl+F5) or try a private window; confirm **Primary domain** on the WordPress site is no longer **nocturneatelier.net**; wait 5–15 minutes for DNS/SSL cache.

---

### Option B: Keep WordPress on a subdomain (usually not needed)

Use this only if you want **both** a WordPress blog and the Node storefront.

1. **Websites** → WordPress site → **Manage** → **Domains**.
2. Remove **nocturneatelier.net** as the WordPress **Primary domain**.
3. **Add subdomain** → **`blog.nocturneatelier.net`** (or `www`) → set that as WordPress primary.
4. Deploy the Node.js Web App per **Option A, Steps 3–5** and assign **`nocturneatelier.net`** as primary on the Node app only.

Result: **`nocturneatelier.net`** → Nocturne Atelier (Node). **`blog.nocturneatelier.net`** → WordPress.

---

### Quick reference — WordPress vs Node on Hostinger

| What you see | What is serving the domain | Fix |
|--------------|----------------------------|-----|
| "Hello world!" / Astra / wp-admin | WordPress website on shared hosting | Option A — deploy Node app, move domain |
| Blank or Hostinger parking page | Domain not assigned to any app | [Domain purchased at Hostinger](#domain-purchased-at-hostinger-nocturneateliernet) |
| Site on `*.hostingersite.com` but wrong on custom domain | Node app exists; domain still on WordPress | Option A, Step 4 — primary domain on Node app |
| Correct UI but API fails | Node app partial deploy / env vars | Check build logs, `/api/health`, [Environment variables](#environment-variables-all-scenarios) |

---

## Using your Hostinger access code

Hostinger uses the phrase **“access code”** in different places depending on your plan. Match what you received to one of the scenarios below.

| What you received | Where to enter it | Use for this project? |
|-------------------|-------------------|------------------------|
| **SSH password or one-time browser SSH code** | hPanel → **VPS** → **SSH access**, or your local terminal when `ssh` prompts for a password | **Yes (VPS)** — full Node deploy (JSON file storage) |
| **FTP username + password** | FileZilla, Hostinger File Manager, or hPanel → **Files → FTP Accounts** | **Partial** — static `dist/` only; API must run elsewhere |
| **Git deploy / repository password** | hPanel → **Websites → Manage → Git** when connecting a repo | **Yes (shared hosting with Git)** — if Node.js app is available on your plan |
| **hPanel login / temporary access link** | [hpanel.hostinger.com](https://hpanel.hostinger.com) sign-in or email invite link | **Setup only** — not used inside the app |
| **Node.js Web App “Connect GitHub”** | hPanel → **Websites → Advanced → Node.js** — OAuth to GitHub, no access code in repo | **Yes (recommended on Business/Cloud)** |

If you are unsure which type you have, see [Which plan do I have?](#which-plan-do-i-have) at the end and reply with the scenario (SSH VPS, FTP, or hPanel Node app) — **do not send the code itself**.

---

## Scenario 1 — VPS (KVM) via SSH access code

**When:** You bought a Hostinger VPS, or hPanel shows **VPS → SSH access** with a root/`u123456789` user and password or browser terminal.

**Where to enter the access code**

1. **Browser SSH (easiest):** hPanel → **VPS** → **SSH access** → **Browser terminal**. Paste or type the password when prompted (nothing appears while typing — normal).
2. **Local terminal (Windows PowerShell):**
   ```powershell
   ssh root@YOUR_VPS_IP
   ```
   Or, if Hostinger gave a non-root user:
   ```powershell
   ssh u123456789@YOUR_VPS_IP
   ```
   Enter the SSH password when prompted. Do not put the password in the command line.

**First-time server setup**

```bash
# Update system (Ubuntu/Debian VPS)
sudo apt update && sudo apt upgrade -y

# Install Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

# Install PM2 globally
sudo npm install -g pm2

# Clone the repo (HTTPS — no deploy token in URL)
cd ~
git clone https://github.com/aa619172/nocturne-atelier.git
cd nocturne-atelier

# Create production env (edit with nano — never commit .env)
cp .env.example .env
nano .env
```

Set at minimum in `.env`:

- `NODE_ENV=production`
- `PORT=3001`
- `SITE_URL=https://nocturneatelier.net`
- `JWT_SECRET=` (long random string)
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

**Build and start with PM2**

```bash
npm ci
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # run the command it prints so the app survives reboot
```

**Later deploys** (after `git pull` on the server):

```bash
./scripts/deploy.sh
```

Or manually: `git pull`, `npm ci`, `npm run build`, `pm2 restart nocturne`.

**HTTPS and domain on VPS**

1. hPanel or your registrar: point **nocturneatelier.net** A record to the VPS IP.
2. On the VPS, install nginx + Certbot and proxy port 443 → `http://127.0.0.1:3001`.
3. Enable SSL in hPanel for the domain if DNS is managed there, or use Certbot on the VPS.

---

## Scenario 2 — hPanel Node.js Web App (Business / Cloud)

**When:** hPanel has **Websites → Manage → Advanced → Node.js** (or **Node.js Web App**). You connect GitHub — no SSH access code required for day-to-day deploys.

### Fix: "Unsupported framework or invalid project structure"

This repo is a **Vite frontend + Express API** monolith (not a pure Vite static site). Hostinger’s auto-detector often fails because:

- `vite.config.ts` makes it look like a static Vite app (no server entry).
- The Express app lived under `server/index.js` instead of a root entry file.
- Hostinger’s Express tutorial defaults to **`app.js`**, not `server/index.js`.

The repo now includes root entry files **`app.js`** (canonical), plus **`server.js`** and **`index.js`** aliases. In hPanel, **do not** use the **Vite** or **React** preset — choose **Express.js** or **Other**.

**If you still see this error after connecting GitHub**, the cause is almost always one of:

1. **Unpushed commits** — Hostinger reads GitHub, not your PC. Run `git push origin main` so `app.js` and `package.json` are on `main`.
2. **Wrong framework preset** — Auto-detect picked **Vite** (static-only). Change to **Express.js** or **Other** manually.
3. **Wrong entry file** — Set **Entry file** to `app.js` (or `server.js` / `index.js`). Do not leave it blank or `server/index.js`.
4. **Wrong application root** — Must be `/` (repo root where `package.json` lives).

### Persistent "Unsupported framework" — hPanel click-by-click

Use this when the error appears **before** the first successful deploy (during repo import or Settings and redeploy):

1. **Websites** → your Node.js site → **Manage**.
2. Open **Settings and redeploy** (or the gear icon on the Node.js dashboard).
3. **Framework preset** → open the dropdown → select **Express.js** (first choice) or **Other** (if Express is not listed).
   - Do **not** select: Vite, React, Vue, Angular, or any frontend-only preset.
4. **Application root** → type `/` (single slash, repository root).
5. **Entry file** → type `app.js` exactly (lowercase, no path prefix).
6. **Output directory** → type `dist` (required when framework is **Other**; safe to set for Express too).
7. **Node.js version** → `20`.
8. **Package manager** → `npm`.
9. **Install command** → `npm ci --include=dev`
10. **Build command** → `npm run build`
11. **Start command** → `npm run start`
12. Click **Save** then **Redeploy** (or **Deploy** on first setup).

**First-time GitHub import:** After selecting repo `aa619172/nocturne-atelier` and branch `main`, Hostinger may show auto-detected settings. **Change the framework dropdown before clicking Deploy** — do not accept a Vite/React suggestion.

**Verify GitHub has the files:** On GitHub, open the repo root and confirm you see `package.json`, `app.js`, `server.js`, and `package-lock.json` on branch `main`. If `app.js` is missing, push local commits first.

### Exact hPanel Node.js settings

After connecting GitHub repo `aa619172/nocturne-atelier` (branch `main`), open **Settings and redeploy** and enter:

| Setting | Value |
|---------|--------|
| **Application root** | `/` (repository root — `package.json` must be at top level) |
| **Framework preset** | **Express.js** or **Other** (not Vite, not React) |
| **Node.js version** | `20` |
| **Package manager** | `npm` |
| **Install command** | `npm ci --include=dev` |
| **Build command** | `npm run build` |
| **Start command** | `npm run start` |
| **Entry file** | `app.js` |
| **Output directory** | `dist` (only required when framework is **Other**) |

`npm ci --include=dev` ensures Vite and TypeScript (devDependencies) are installed before `npm run build`. If install already includes dev deps on your plan, plain `npm ci` also works.

**Where credentials go**

- **GitHub:** Authorize Hostinger in hPanel when prompted (OAuth). Do not store tokens in the repo.
- **Environment variables:** hPanel → your Node.js app → **Environment variables**. Paste `JWT_SECRET`, Stripe keys, etc. there — not in git.
- **Build / start commands** (must match table above if auto-detect failed):

  | Setting | Value |
  |---------|--------|
  | Repository | `https://github.com/aa619172/nocturne-atelier` |
  | Branch | `main` |
  | Framework | **Express.js** or **Other** |
  | Application root | `/` |
  | Entry file | `app.js` |
  | Output directory | `dist` |
  | Node version | `20` |
  | Install | `npm ci --include=dev` |
  | Build | `npm run build` |
  | Start | `npm run start` |

**Domain**

1. hPanel → **Domains** → attach **nocturneatelier.net** to this website/app.
2. Turn on **SSL** (Let’s Encrypt) after DNS propagates.

**Deploy flow:** Push to `main` on GitHub → Hostinger pulls, builds, and restarts. No access code in the repository.

### Storage (no native modules)

Auth and orders use **JSON file storage** (`server/users.json`, `server/orders.json`) — the same pattern as `contacts.json` and `subscribers.json`. This avoids `better-sqlite3`, which requires Python and node-gyp to compile on Linux and **fails on Hostinger shared Node.js** builds. **Already fixed on `main`** (no `better-sqlite3` in `package.json`); trigger a redeploy from GitHub if Hostinger still shows an old build error.

Ensure the app process can write under `server/` (default on Node.js Web App). User and order files are gitignored; they are created on first register/checkout.

### If build log still shows `better-sqlite3`

GitHub `main` is **clean** — verify with the raw files (no `better-sqlite3` in either):

- [package.json](https://raw.githubusercontent.com/aa619172/nocturne-atelier/main/package.json)
- Search [package-lock.json](https://raw.githubusercontent.com/aa619172/nocturne-atelier/main/package-lock.json) for `better-sqlite3` (should return nothing)

If Hostinger’s build log still installs `better-sqlite3`, it is deploying **wrong source**: an old commit, the wrong repo, or a cached clone/lockfile — not the current GitHub `main`.

**1. Verify hPanel Git settings (exact values)**

Websites → your Node.js app → **Manage** → **Settings and redeploy**:

| Setting | Required value |
|---------|----------------|
| Repository URL | `https://github.com/aa619172/nocturne-atelier` — **not** a Hostinger slug repo, fork, or mirror |
| Branch | `main` only (not a feature branch or pinned old commit) |
| Install command | `npm ci --include=dev` (matches `.hostinger/deploy.json` and `package.json` → `hostinger.install`) |

**2. Check the build log commit hash**

Open the latest deployment **build log** and find the git clone / checkout step. The **commit SHA** must be **`8c4b7c1` or newer** (JSON storage, no native modules). Commits before `31bb974` still included `better-sqlite3`.

**3. Clear cache and redeploy**

1. **Settings and redeploy** → enable **Clear build cache** / **Clear cache and redeploy** if shown.
2. **Save** → **Deploy** (or **Redeploy**).
3. Confirm the install step runs `npm ci` without `better-sqlite3`, `node-gyp`, or `Python`.

**4. Delete and recreate the Node.js app (last resort)**

If the log still shows `better-sqlite3` after a cache-clear redeploy:

1. Export / note all **environment variables** from the current app.
2. **Delete** the Node.js Web App in hPanel (removes stale server-side clone/cache).
3. **Create** a new Node.js Web App → connect GitHub → repo `aa619172/nocturne-atelier`, branch `main`.
4. Set install command to `npm ci --include=dev`, re-enter env vars, deploy.
5. Re-attach **nocturneatelier.net** and SSL if needed.

You do **not** need Python or node-gyp on Hostinger for this project after `31bb974`.

### If Node.js Web App still fails

If build/deploy succeeds but runtime errors persist (permissions, webhooks, Stripe), use [Scenario 1 — VPS](#scenario-1--vps-kvm-via-ssh-access-code) instead (full control, PM2, nginx).

If hPanel asks for a **Git deploy password** when using their Git panel (not GitHub OAuth), create it in hPanel → **Git** and enter it only in hPanel — never in this repo.

---

## Scenario 3 — FTP access (shared hosting, static only)

**When:** Email or hPanel shows **FTP hostname**, **username**, and **password** (sometimes labeled FTP access). Typical host: `ftp.nocturneatelier.net` or a `*.hostingersite.com` hostname.

**Where to enter credentials**

- hPanel → **Files → File Manager**, or
- An FTP client (FileZilla): **Host**, **Username**, **Password** fields only in the client — not in git.

**Limitation:** FTP uploads static files. This project needs a running Node server for auth, checkout, and webhooks. FTP alone is **not enough** unless you also run the API on a Node-enabled plan or VPS.

If you only have FTP hosting:

1. Run the full app on a VPS or Node.js Web App (scenarios 1 or 2).
2. Point **nocturneatelier.net** DNS to that service.
3. Do **not** upload only `dist/` to `public_html` unless the API is on the same origin elsewhere.

---

## Scenario 4 — DNS only (domain at Hostinger, app elsewhere)

**When:** You registered **nocturneatelier.net** at Hostinger but deploy on VPS or Node.js app.

1. hPanel → **Domains** → **nocturneatelier.net** → **DNS / Nameservers**.
2. **A record:** `@` → VPS IP (scenario 1) or IP Hostinger gives for Node.js app.
3. **CNAME:** `www` → `@` or your app hostname (follow hPanel hints).
4. Wait for propagation (up to 24–48 hours; often minutes).
5. Enable **SSL** under **SSL** for the domain.

No access code is used for DNS — only hPanel login.

---

## Domain isn't connected (troubleshooting)

Hostinger shows **"Domain isn't connected to your website"** when **nocturneatelier.net** is registered or parked in your account but not **assigned** to a live website or Node.js app, or when DNS does not point to Hostinger yet.

**Bought the domain at Hostinger?** Start with [Domain purchased at Hostinger](#domain-purchased-at-hostinger-nocturneateliernet) — nameservers are usually already correct; you almost always only need to create/connect the website and assign the domain.

Work through the steps below in order.

### Step 0 — Confirm you have a website (not just a domain)

1. Sign in at [hpanel.hostinger.com](https://hpanel.hostinger.com).
2. Left menu → **Websites**.
3. You should see a site (Node.js Web App, shared hosting, or VPS-linked site). If the list is empty:
   - **Add Website** → choose **Node.js Web App** (recommended for this project) or your hosting plan.
   - Connect GitHub repo `aa619172/nocturne-atelier`, set build/start commands per [Scenario 2](#scenario-2--hpanel-nodejs-web-app-business--cloud).
4. A domain alone does not serve the app — the website/Node app must exist first.

### Step 1 — Assign the domain in hPanel

**If nocturneatelier.net is registered WITH Hostinger:**

1. hPanel → **Websites** → select your Nocturne Atelier site → **Manage**.
2. Open **Domains** (or **Connect domain** / **Assign domain**).
3. Click **Connect domain** or **Add domain** → choose **nocturneatelier.net** (or type it).
4. Set **nocturneatelier.net** as the **Primary domain** (not only a parked alias).
5. For **Node.js Web App:** also check **Websites → Manage → Advanced → Node.js** → your app → **Domains** → attach **nocturneatelier.net**.
6. hPanel → **Security → SSL** (or **Websites → SSL**) → enable **Let's Encrypt** for **nocturneatelier.net**. SSL may stay pending until DNS is correct (Step 2).

**If nocturneatelier.net is registered ELSEWHERE (GoDaddy, Namecheap, Google Domains, etc.):**

Pick **one** approach:

| Approach | Where to configure | What to set |
|----------|-------------------|-------------|
| **Nameservers (easiest)** | Your registrar's DNS/nameserver settings | Point to Hostinger NS shown in hPanel → **Domains** → **nocturneatelier.net** → **DNS / Nameservers** (often `ns1.dns-parking.com`, `ns2.dns-parking.com` — **use the exact values from your hPanel**, they can differ per account). |
| **A record only** | Registrar DNS zone | **A** `@` → Hostinger website IP (hPanel → **Websites** → **Manage** → **Plan details** or **Hosting** → **Website IP**). Optional **CNAME** `www` → `@` or the hostname hPanel suggests. |

After changing DNS at the registrar, return to hPanel and **assign** the domain to your website (steps above). Hostinger must know which site should answer for that domain.

**Propagation:** DNS changes can take up to 24–48 hours; often 15–60 minutes.

### Step 2 — Verify DNS points to Hostinger

**Windows PowerShell:**

```powershell
nslookup nocturneatelier.net
nslookup -type=NS nocturneatelier.net
```

- **A record:** the returned IP should match your Hostinger **Website IP** (VPS IP if you use [Scenario 1](#scenario-1--vps-kvm-via-ssh-access-code)).
- **Nameservers:** if you delegated to Hostinger, NS should list Hostinger nameservers from hPanel.

**Hostinger domain checker:**

1. hPanel → **Domains** → **nocturneatelier.net**.
2. Open **DNS / Nameservers** or the domain status panel — Hostinger shows whether the domain is **Connected**, **Pointing elsewhere**, or **Not connected**.

**Browser (after DNS + SSL):**

- `https://nocturneatelier.net` loads the site (not a parking page).
- `https://nocturneatelier.net/api/health` returns `{"ok":true,...}`.

### Common causes and fixes

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Banner: domain not connected | Domain parked, not assigned to a website | **Websites → Manage → Domains → Connect** and set primary |
| Site works on `*.hostingersite.com` but not custom domain | Custom domain not attached to Node app | **Node.js** app settings → **Domains** → add **nocturneatelier.net** |
| SSL stuck on "Pending" | DNS not propagated or wrong A record | Fix A/NS at registrar; wait; retry SSL in hPanel |
| Wrong IP in `nslookup` | Old A record or registrar still using old NS | Update A record or switch nameservers to Hostinger |
| "Website" missing in hPanel | Only domain purchased, no hosting | **Add Website** (Node.js Web App) then connect domain |
| **"Hello world!" / WordPress / Astra** | Domain assigned to auto-installed WordPress, Node app not deployed | [WordPress showing instead of your site](#wordpress-showing-instead-of-your-site) |
| FTP-only plan | Static hosting cannot run this Node app | Upgrade to Node.js Web App or VPS ([Scenario 2](#scenario-2--hpanel-nodejs-web-app-business--cloud) or [Scenario 1](#scenario-1--vps-kvm-via-ssh-access-code)) |

### Node.js Web App — domain checklist

1. Node app created and deployed (build succeeds in hPanel).
2. **nocturneatelier.net** listed under the app's **Domains**.
3. Domain set as **primary** on the website.
4. DNS A record or nameservers point to Hostinger.
5. **SSL** enabled (Let's Encrypt).
6. `SITE_URL=https://nocturneatelier.net` in hPanel **Environment variables**.

---

## Environment variables (all scenarios)

Set these in `.env` on VPS or in hPanel **Environment variables** — never in git.

| Variable | Production value |
|----------|------------------|
| `NODE_ENV` | `production` |
| `PORT` | Leave unset on Hostinger (platform sets `PORT`; app default `3000`) or `3001` on VPS |
| `HOST` | Optional — default `0.0.0.0` (bind all interfaces) |
| `SITE_URL` | `https://nocturneatelier.net` |
| `JWT_SECRET` | Long random string |
| `STRIPE_SECRET_KEY` | From Stripe Dashboard |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhook endpoint |

Generate `JWT_SECRET` (PowerShell on your PC):

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

Stripe webhook URL: `https://nocturneatelier.net/api/webhooks/stripe`

---

## PM2 and deploy script (VPS)

- **`ecosystem.config.cjs`** — PM2 process definition (`pm2 start ecosystem.config.cjs`).
- **`scripts/deploy.sh`** — pull, install, build, restart PM2. Run on the server after SSH in.

Health check after deploy: `https://nocturneatelier.net/api/health` should return `{"ok":true,...}`.

---

## Which plan do I have?

Open [hpanel.hostinger.com](https://hpanel.hostinger.com) and check the left menu:

| You see in hPanel | Your access code is probably | Follow |
|-------------------|------------------------------|--------|
| **VPS** section with IP address | SSH password for `root` or `u…` user | [Scenario 1](#scenario-1--vps-kvm-via-ssh-access-code) |
| **Node.js** under website Advanced | GitHub connect + env vars in hPanel | [Scenario 2](#scenario-2--hpanel-nodejs-web-app-business--cloud) |
| **FTP Accounts**, **File Manager**, no Node.js | FTP username/password | [Scenario 3](#scenario-3--ftp-access-shared-hosting-static-only) — consider upgrading or adding VPS for this app |
| Only **Domains** and DNS | Domain registrar / DNS | [Scenario 4](#scenario-4--dns-only-domain-at-hostinger-app-elsewhere) |

---

## Quick checklist

- [ ] Identified access type (SSH / Node.js Git / FTP / DNS)
- [ ] Credentials entered only in hPanel, SSH, or FTP client
- [ ] `.env` or hPanel env vars set (not committed)
- [ ] `npm run build` && `npm run start` (or PM2) on server
- [ ] Website or Node.js app exists in hPanel (not domain-only)
- [ ] **nocturneatelier.net** assigned as primary domain on that website/app
- [ ] DNS A/CNAME or nameservers for **nocturneatelier.net** point to Hostinger
- [ ] SSL enabled
- [ ] Stripe webhook points to production URL

If Hostinger shows **"Domain isn't connected"** and the domain was bought at Hostinger, see [Domain purchased at Hostinger](#domain-purchased-at-hostinger-nocturneateliernet). For external registrars or DNS issues, see [Domain isn't connected (troubleshooting)](#domain-isnt-connected-troubleshooting). If you see **WordPress "Hello world!"** instead of the app, see [WordPress showing instead of your site](#wordpress-showing-instead-of-your-site).

For Stripe steps and CI templates, see [DEPLOYMENT.md](./DEPLOYMENT.md).
