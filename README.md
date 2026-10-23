# Sufi Store Worker (Universal Template)

A universal Cloudflare Worker template for Sufi storefronts. Each store forks this repo and edits `config.json` with their own data.

## Setup

1. Fork this repo
2. Edit `config.json` with your store's data (name, products, theme colors, contact info, etc.)
3. Deploy:

```bash
npm install
npm run deploy
```

## How it works

- `/api/*` requests return data from `config.json`
- `/logo.svg`, `/logo.png`, `/logo.jpeg` return a generated SVG logo with the store name
- `/favicon.ico`, `/favicon.svg` return a generated SVG favicon
- All other requests are proxied to the main Sufi Pages URL (`https://web-sufi.aivoo.app/`)
- The main app renders the store using the API data

## Customization

### config.json (rarely changes — branding & theme)
- `storeName`, `heroTitle`, `heroSubtitle` — store branding
- `theme.brand` — color palette (50-900 shades)
- `contact` — email, phone, address
- `privacy`, `terms` — legal content (markdown)

### content.json (frequently changes — catalog & content)
- `categories` — store categories
- `heroSlides` — hero slider items
- `notifications` — store notifications
- `products` — product catalog with variants, specs, media

## Origin URL

Update `ORIGIN` in `src/index.js` if your main Sufi Pages URL changes.