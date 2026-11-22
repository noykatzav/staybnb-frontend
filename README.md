# Staybnb Frontend

React frontend for the Staybnb accommodation application. The project is built with React 18 and Vite, with React Router for navigation and Redux for application state.

The repository contains a starter application. Some routes and pages, including chat, reviews, admin, and authentication scaffolding, are part of the starter and do not represent confirmed product requirements.

## Quick Start

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`).

## Data Modes

Services can use local browser storage or a remote backend.

| Command | Mode |
| --- | --- |
| `npm run dev` | Local browser-storage services (default) |
| `npm run dev:local` | Local browser-storage services |
| `npm run dev:remote` | Remote services |

When running against the backend, the API base URL is `http://localhost:3030/api/` during development.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite using local browser-storage services (default) |
| `npm run dev:local` | Start Vite using local browser-storage services |
| `npm run dev:remote` | Start Vite using remote services |
| `npm run build` | Create a production build in `dist/` |
| `npm run lint` | Run ESLint |
| `npm test` | Run the automated tests |
| `npm run test:watch` | Re-run tests when files change |
| `npm run preview` | Preview the production build locally |

Tests use Node's built-in test runner and require Node.js 20 or newer. Run `npm test` after installing dependencies. No browser or backend is required.

The `tests/` directory covers calendar date arithmetic, stay and review state changes, loading state, and the shared storage service (including missing-record errors). Storage tests use isolated in-memory data and never access your browser's saved stays. React interactions and remote API integration are not covered by this suite.

## Project Structure

```text
src/
├── assets/
│   └── styles/        # CSS, variables, layouts, and responsive rules
├── cmps/              # Reusable React components
├── customHooks/       # Shared form and effect hooks
├── pages/             # Routed page components
├── services/          # Local and remote API/storage services
└── store/             # Redux store, actions, and reducers
public/
└── icons/             # Application and category icon assets
```

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page |
| `/stay` | Stay listing |
| `/stay/:stayId` | Stay details |
| `/about` | About page |
| `/review` | Review page |
| `/user/:id` | User details |
| `/chat` | Starter chat page |
| `/admin` | Starter admin page |
| `/auth/*` | Starter authentication routes |

## State and Services

Redux manages `stayModule`, `userModule`, `reviewModule`, and `systemModule`.

Stay, user, and review services include local and remote implementations. The active implementation is selected by the `VITE_LOCAL` environment value. Additional services provide HTTP requests, WebSocket communication, event messaging, uploads, local storage, and utility helpers.

## Styling

The frontend uses plain CSS, organized by base styles, setup variables, and component styles in `src/assets/styles/`.


