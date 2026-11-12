# Humans of EV — Frontend UI

This repository is a frontend-only React and Vite application. It has no application server, database connection, account service, email service, or payment integration.

## Run locally

Install dependencies once:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite. Create a static production build with:

```bash
npm run build
```

The generated site is in `dist/`. It can be hosted on any static web host that supports SPA fallback routing.

## Frontend demo behavior

- Public pages use bundled sample data and placeholder article content.
- Contact and newsletter forms only show a frontend preview confirmation. They do not send or save submitted details.
- Account and administrator sign-in are simulated and are not secure authentication.
- Admin content and website-setting edits are held in memory for the current page session and reset when the page reloads.
- Image/media selections create temporary browser previews; files are not uploaded or saved.
- Membership checkout does not charge a payment or activate a plan.
- Events, community, and learning calls to action are visual UI only.

Do not use the frontend demo for real user accounts, submissions, content publishing, or payments.

## Project structure

- `src/App.jsx` — public routes and frontend application shell.
- `src/data.js` — static sample data and website-content defaults.
- `src/api.js` — in-memory demo data adapter; it makes no network requests and saves nothing.
- `src/AdminPanel.jsx` — frontend administrator interface preview.
- `src/index.css` and `src/styles/` — responsive visual system.
- `vite.config.js` — Vite configuration with no API proxy.
- `Dockerfile` — optional static Nginx container.

The `data/` directory, if present, is not read by the frontend build.
