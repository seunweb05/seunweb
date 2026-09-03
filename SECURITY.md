# Security Policy

## Reporting a vulnerability

Please report security issues privately to the project owner instead of opening a public issue.

## Credential rules

- Firebase web configuration may appear in public browser files.
- Firebase service-account credentials must stay in GitHub Actions Secrets.
- Never commit `.env` files, private keys, passwords, or service-account JSON files.
- Firestore writes are restricted to the approved Firebase Auth editor account.