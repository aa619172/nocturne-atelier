# Nocturne Atelier

Dark music house website — rebuilt from the Nocturne Atelier HTML design.

**Live site:** [nocturneatelier.net](https://nocturneatelier.net/)

**React** + **Vite** + **TypeScript**

## Quick start

```bash
npm install
npm run dev:all
```

- Site: http://localhost:5173
- API: http://localhost:3001

## Structure

- **Hero** — headline + logo with spinning border
- **Manifesto** — founding quote
- **Works** — catalogue listing
- **Services** — commissions grid
- **Listen** — audio player (MP3 or synthesized preview)
- **Contact** — correspondence form → `/api/contact`

## Logo

Place your logo at `public/logo.png`.

## Audio previews

Add MP3s to `public/audio/` matching filenames in `src/data/site.ts`.
