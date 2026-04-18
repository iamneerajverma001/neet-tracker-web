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
