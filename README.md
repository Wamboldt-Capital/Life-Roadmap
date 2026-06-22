# 🗺️ Life Roadmap

A single-page app for mapping your life goals across the years ahead — career,
health, relationships, finance, growth, and adventure. Built with React + Vite.

## Features

- **Timeline view** — goals grouped by target year on a vertical roadmap.
- **Life areas** — color-coded categories with filtering.
- **Status tracking** — Planned → In Progress → Done (click the pill to cycle).
- **Add / edit / delete** goals in a quick form.
- **Progress stats** and a completion bar.
- **Local persistence** — everything is saved to your browser's `localStorage`.

No backend, no account, no build config to fuss with.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (defaults to http://localhost:5173).

## Other scripts

```bash
npm run build     # production build into dist/
npm run preview   # preview the production build
```

## Tech

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)

The dev server binds to all interfaces (`host: true`) so it works inside remote
/ cloud development environments and live previews.
