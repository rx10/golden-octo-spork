# Socratic.pro — Frontend

The web client for [socratic.pro](https://socratic.pro), an AI-powered career automation platform that aggregates job listings, generates tailored resumes, and automates job applications.

Built with Next.js 16 (App Router), React 19, and TypeScript.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **UI:** React 19, Tailwind CSS v4
- **Auth:** JWT session cookies, verified with [`jose`](https://github.com/panva/jose)
- **Language:** TypeScript
- **Linting:** ESLint 9 (flat config)

## Project Structure

```
socratic-fe/
├── app/           # App Router pages, layouts, and route handlers
├── components/    # Shared/reusable React components
├── actions/       # Server actions (form submissions, mutations)
├── lib/           # Utilities, API clients, shared helpers
├── proxy.ts       # Edge middleware — route protection & session validation
└── .claude/       # Claude Code project configuration
```

## Authentication & Route Protection

Session state is stored in a `socratic_session` cookie containing a JWT. `proxy.ts` runs as Next.js middleware on every request (except static assets and API routes) and:

- Redirects unauthenticated users away from protected routes to `/login`
- Redirects already-authenticated users away from `/login` and `/signup` to `/dashboard`
- Clears the session cookie if the JWT is invalid or expired

**Protected routes:** `/dashboard`, `/onboarding`, `/resumes`, `/settings`, `/jobs`
**Auth routes:** `/login`, `/signup`

> Note: the middleware only checks token expiry client-side (via `decodeJwt`, no signature verification) for fast redirects. All real authorization is enforced by the backend API.

## Getting Started

### Prerequisites

- Node.js 20+
- A running instance of the [Socratic.pro backend API](https://github.com/socratic-pro/silver-octo-spork)

### Installation

```bash
git clone https://github.com/socratic-pro/socratic-fe.git
cd socratic-fe
npm install
```

### Environment Variables

Create a `.env.local` file with the backend API URL (adjust the variable name to match what `lib/` expects, e.g.):

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app. Pages under `app/` support hot reload.

### Available Scripts

| Command         | Description                       |
|-----------------|-----------------------------------|
| `npm run dev`   | Start the development server      |
| `npm run build` | Build for production              |
| `npm run start` | Run the production build          |
| `npm run lint`  | Run ESLint                        |

## Deployment

This is a standard Next.js app and deploys cleanly to [Vercel](https://vercel.com/new) or any Node-compatible host. Ensure `NEXT_PUBLIC_API_URL` (or equivalent) points at the production backend and that the backend's CORS allow-list includes the deployed frontend origin.

## Related Repositories

- **Backend / API:** [socratic-pro/silver-octo-spork](https://github.com/socratic-pro/silver-octo-spork)

## License

Proprietary — © Socratic Pro Private Limited. All rights reserved.
