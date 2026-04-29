# NEET Smart Tracker (neet-tracker-web)

This repository contains the NEET Smart Tracker — a small Vite + React + TypeScript app to track NEET study progress.

Quick start

1. Install dependencies

```bash
npm install
```

2. Run development server

```bash
npm run dev
```

3. Build

```bash
npm run build
```

Deployment (GitHub Pages)

This project uses a GitHub Actions workflow to build and publish the `dist/` folder to GitHub Pages on push to the `main` branch. After pushing to GitHub, the Pages action will run automatically.

Site URL (after repo creation)

If your GitHub username is `USERNAME` and repo is `neet-tracker-web`, the Pages URL will be:

```
https://USERNAME.github.io/neet-tracker-web/
```

If you prefer to push manually instead of letting the assistant create the repo, run:

```bash
git init
git add .
git commit -m "chore: initial commit"
# Create repo on GitHub then add remote
git remote add origin https://github.com/<USERNAME>/neet-tracker-web.git
git branch -M main
git push -u origin main
```

Notes
- The GitHub Actions workflow builds with `npm ci` and `npm run build` and deploys the `dist/` folder to Pages.
- If you want the repository to be private, edit the repo settings after creation and enable Pages for a private repo (or use a deployment token).
# NEET Tracker Web App

React + TypeScript + Vite app for NEET Physics/Chemistry progress tracking.

## Features

- Persistent progress using localStorage
- Topic search and filter (subject + tier)
- Quick jump to next pending topic by tier
- Import/export/reset progress
- Modular component and data architecture
- Utility tests with Vitest

## Prerequisite

Install Node.js (LTS) from https://nodejs.org/

Verify:

```powershell
node -v
npm -v
```

## Local development

```powershell
npm install
npm run dev
```

## Validate

```powershell
npm run build
npm run test
```

## Deploy options

### Option A: GitHub Actions (recommended)

1. Push this folder to your GitHub repository.
2. Open repo Settings -> Pages.
3. Set source to GitHub Actions.
4. Push to main branch.
5. Workflow at .github/workflows/deploy.yml publishes automatically.

### Option B: Local deploy command

Set base path for repo and deploy:

```powershell
$env:VITE_BASE_PATH="/YOUR_REPO_NAME/"
npm run deploy
```
