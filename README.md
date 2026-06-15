# Security+ Study (SY0-701)

A zero-dependency single-page web app for studying for the **CompTIA Security+ (SY0-701)** exam. No build step, no server, no internet required — just open `index.html` in any modern browser.

## Features

- **Quiz** — 200+ multiple-choice questions, randomized, with instant feedback and an explanation for every answer. Score/accuracy is tracked across sessions and can be filtered by category.
- **Flashcards** — flip cards combining acronyms, key terms, and ports. Click or press `Space` to flip; arrow keys to navigate.
- **Ports drill** — a searchable port/protocol table (type `ssh`, `443`, `ldap`, …).
- **PBQ** — performance-based questions (matching and ordering tasks) in the style of the ~15% of the real exam.
- **Reference** — acronyms and terms grouped by topic for quick review.

Progress is saved in the browser via `localStorage`.

## Coverage

Questions span all five exam domains: General Security Concepts, Threats/Vulnerabilities/Mitigations, Security Architecture, Security Operations, and Security Program Management & Oversight.

## Running it

Open `index.html` directly (double-click), or serve the folder with any static server:

```bash
# optional — only if you prefer http://
python -m http.server 8000
```

The app intentionally uses plain `<script>` tags (not ES modules) so it works over the `file://` protocol with no CORS issues.

## Adding content

All study content lives in `questions.js` as plain arrays — `QUESTIONS`, `PORTS`, `TERMS`, and `PBQS`. Append new entries in the same shape; no other file needs changing.

```js
// QUESTIONS entry: a = index of the correct option; backticks render as inline code
{ cat: "Cryptography", q: "Which algorithm is symmetric?", o: ["AES", "RSA", "ECC", "DH"], a: 0, e: "AES uses one shared key." }
```

## Files

| File | Purpose |
|------|---------|
| `index.html` | App shell and navigation |
| `styles.css` | Styling |
| `app.js` | View logic / mode rendering |
| `questions.js` | All study content (questions, ports, terms, PBQs) |
