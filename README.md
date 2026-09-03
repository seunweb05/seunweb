# Seun Web News

A responsive news publishing platform and portfolio project by Seun Joel.

Live demo: https://seunnewsite2026.web.app

GitHub repository: https://github.com/seunweb05/seunweb

## What this demonstrates

- Responsive HTML and CSS newsroom interface
- Firebase Hosting deployment
- Firebase Authentication for editor access
- Firestore publishing with protected write rules
- Manual article creation, editing, drafts, publishing, and deletion
- GitHub Actions RSS sync every six hours
- Accessible navigation, focus states, and reduced-motion support

## Run locally

```powershell
npm install
npm run sync-news
```

The RSS sync requires these environment variables and should only be run with private credentials:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

## Deploy hosting

```powershell
firebase login
firebase use seunnewsite2026
firebase deploy --only hosting,firestore
```

## GitHub Actions setup

This project uses the free GitHub Actions runner and free RSS feeds. It does not use a paid GNews API. For a public GitHub repository, scheduled Actions are free. Add these repository secrets under **Settings > Secrets and variables > Actions**:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

The workflow in `.github/workflows/sync-news.yml` runs every six hours and can also be started manually from the **Actions** tab. The Firebase project still needs Firestore and Email/Password Authentication enabled, but no GNews subscription is required.

To use it:

1. Push this folder to a GitHub repository.
2. Add the three secrets above.
3. Open **Actions > Sync News > Run workflow** for the first free run.

## Portfolio talking points

This project is suitable to show clients because it demonstrates a complete product workflow, not just a static landing page:

- A polished public-facing newsroom
- A protected editor dashboard
- Firebase Authentication and Firestore security rules
- Responsive design for mobile, tablet, and desktop
- Automated content publishing with GitHub Actions
- A clean separation between public browser configuration and private server credentials

When sharing this project, send the live demo first and the GitHub repository second. Never add Firebase service-account JSON files, private keys, or API secrets to the repository.

## Live project

Firebase Hosting project: `seunnewsite2026`
