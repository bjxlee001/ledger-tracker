# Ledger — personal portfolio tracker

A browser-based investment tracker with TWR/XIRR performance, risk analytics (Sharpe, Sortino, alpha, beta, max drawdown), allocation charts, and benchmark comparison. All data stays in your browser's localStorage.

## Project structure

```
ledger-tracker/
├── api/
│   └── chart.js          # Vercel serverless function — proxies Yahoo Finance
├── public/
│   └── index.html         # The entire app (single HTML file)
├── vercel.json            # Routing and cache config
├── package.json
└── .gitignore
```

## Deploy to Vercel

### Option A: Deploy via GitHub (recommended)

1. Push this folder to a GitHub repo:
   ```bash
   cd ledger-tracker
   git init
   git add -A
   git commit -m "initial commit"
   gh repo create ledger-tracker --private --source=. --push
   ```

2. Go to [vercel.com/new](https://vercel.com/new), import the repo, and click **Deploy**. No build settings needed — Vercel auto-detects the structure.

### Option B: Deploy via Vercel CLI

1. Install the CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd ledger-tracker
   vercel
   ```
   Follow the prompts. It will ask for project name and settings — accept the defaults.

3. For production:
   ```bash
   vercel --prod
   ```

## How it works

- **Locally (file://)** — the app uses public CORS proxies to reach Yahoo Finance. Works but can be flaky.
- **On Vercel (https://)** — the app calls `/api/chart?symbol=AAPL` which hits a serverless function that fetches Yahoo Finance directly. Fast, reliable, and cached at the edge for 1 hour.

## Data

All portfolio data (transactions, capital flows) is stored in your browser's `localStorage`. Use the **Export** button regularly to back up as JSON. The **Import** button restores from a backup file.

> **Important:** localStorage is per-domain. Your local file data and your Vercel deployment data are separate. Export from one and import into the other to migrate.
