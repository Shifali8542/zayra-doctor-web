# Zayra Doctor — Web

Production-ready React + TypeScript + Tailwind web port of the Zayra cardiology
review app, converted pixel-faithfully from the original React Native UI.

## Stack

- **React 18** + **TypeScript**
- **Vite** for bundling and dev server
- **Tailwind CSS** for styling (CSS variables drive the light/dark themes)
- **React Router v6** for navigation
- **TanStack Query (React Query)** for data fetching / caching
- **Modular architecture** — components, pages, hooks, services, types, mocks
  are each isolated in their own folder

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Run dev server (opens http://localhost:5173)
npm run dev

# 3. Build for production
npm run build

# 4. Preview the production build
npm run preview
```

## Project structure

```
src/
├── components/         # Reusable UI primitives (Button, Card, Avatar, etc.)
├── pages/              # One file per page/route
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Home.tsx        # PulseDesk
│   ├── Cases.tsx
│   ├── TraceView.tsx
│   ├── Alyna.tsx
│   ├── Impact.tsx
│   ├── Profile.tsx
│   └── ClaimDetail.tsx
├── hooks/              # Custom hooks (useDashboard, useCases, useAuth, ...)
├── services/
│   └── api.ts          # Centralized API layer + endpoint constants
├── types/
│   └── index.ts        # All TypeScript interfaces and types
├── mocks/
│   └── mockData.ts     # Mock fixtures, structured to match the API
├── context/            # React contexts (Theme, Auth)
├── utils/              # format helpers, cn() class composer
├── App.tsx             # Router with protected routes
├── main.tsx            # Providers (QueryClient, Theme, Auth)
└── index.css           # Tailwind layers + CSS variable theme tokens
```

## Theming

- **Light theme is the default** (matches the original design exactly).
- Toggle theme on the **Profile** page using the sun/moon button.
- Colors live as CSS variables in `src/index.css` and are also mirrored in
  `tailwind.config.js` for utility classes.
- Dark mode is activated by adding the `dark` class to `<html>`, handled
  automatically by `ThemeContext`.

## Authentication

- The **Login** and **Signup** pages both expose a "Skip for now" button that
  bypasses the auth flow and routes directly to `/home`, as requested.
- Auth state is persisted in `localStorage` so reloads keep the user logged in.
- Routes under `/home`, `/cases`, `/trace`, `/alyna`, `/impact`, `/profile`,
  `/case/:caseId` are protected — unauthenticated users are redirected to `/login`.

## Replacing mock data with a real API

Every API call goes through `src/services/api.ts`. The endpoint constants in
`API_ENDPOINTS` and the function signatures of `casesApi`, `dashboardApi`, etc.
are stable. To switch to a real backend:

1. Set `VITE_API_BASE_URL` in a `.env` file.
2. Replace the body of each function with `fetch(...)` or `axios(...)` calls
   that hit `${API_BASE_URL}${API_ENDPOINTS.foo}`.
3. The hooks in `src/hooks/` and the components consuming them require **no
   changes** — they read from React Query keys that are already wired up.
4. Optionally delete `src/mocks/mockData.ts`.

## Responsive behavior

- **Mobile (≤640px)**: single-column layout, stacked cards, full-width buttons,
  bottom tab bar.
- **Tablet & Desktop**: content centers within `max-w-3xl` to keep readable line
  lengths and preserve the original mobile-app aesthetic on wide screens.
- All paddings, gaps, and font sizes use Tailwind's responsive utilities.

## Pages map

| Route               | Page             | Notes                                      |
|---------------------|------------------|--------------------------------------------|
| `/login`            | Login            | Has "Skip for now" → goes to `/home`       |
| `/signup`           | Signup           | Has "Skip for now" → goes to `/home`       |
| `/home`             | PulseDesk        | Hero gradient + stats + live cases list    |
| `/cases`            | Cases            | Live / Claimed / Completed tabs            |
| `/case/:caseId`     | Claim Detail     | Full case workup + ActionPath              |
| `/trace/:caseId?`   | TraceView        | ECG strips with Before/During/After zoom   |
| `/alyna`            | Alyna Assist     | AI chat assistant                          |
| `/impact`           | Impact           | Rank, decision confidence, lifesaving log  |
| `/profile`          | Profile          | Availability, notifications, theme toggle  |

## License

Internal — replicates an existing private app for porting purposes.
