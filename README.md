# Nextudy — Frontend

Nextudy is an AI-powered collaborative study platform. Users upload study materials, organize them into workspaces, and use AI-driven tools to generate Q&A question sets, flashcard decks, and quizzes. A real-time chat interface lets users query their documents using an AI assistant. Workspaces are collaborative — members can be invited with role-scoped access controls.

This repository is the Next.js frontend. It communicates with a separate REST/WebSocket backend and is deployed as a standalone Docker image.

---

## Tech Stack

| Concern | Library | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | File-based routing, Server Components, standalone output |
| UI | React 19 | Concurrent features, `startTransition` for non-blocking state |
| Language | TypeScript 5 (strict) | Full type safety across the entire data layer |
| Styling | TailwindCSS 4, shadcn/ui, Radix UI | Utility-first CSS with accessible headless primitives |
| Server state | TanStack React Query 5 | Caching, background refetch, optimistic updates |
| Forms | React Hook Form + Zod | Schema-validated forms with inferred TypeScript types |
| HTTP | Axios | Interceptor-based token refresh and request queuing |
| Real-time | Socket.io-client 4 | Bi-directional chat with AI streaming |
| Auth | Custom JWT flow + `@react-oauth/google` | Access/refresh token pair; Google OAuth support |
| Error tracking | Sentry (`@sentry/nextjs`) | Session replay, traces, and error capture across client, server, and edge |
| Drag-and-drop | react-dnd + html5-backend | Reordering cards and resources |
| Document parsing | mammoth | In-browser DOCX → HTML conversion for the resource viewer |
| Date formatting | date-fns 4 | Tree-shakeable date utilities |
| Notifications | sonner | Toast notifications |
| Themes | next-themes | System-aware dark/light mode |
| Analytics | Google Analytics (gtag) | Consent-gated event tracking via a typed wrapper |
| Dev tooling | Bun 1.3.10, Turbopack, react-scan, Prettier, ESLint | Fast installs and builds; render performance profiling in development |

---

## Project Structure

```
.
├── app/                     # Next.js App Router pages and layouts
│   ├── layout.tsx           # Root layout — providers, fonts, SEO metadata
│   ├── sitemap.ts           # Dynamic sitemap generation
│   ├── api/
│   │   └── logout/route.ts  # Route Handler that clears the refreshToken cookie
│   ├── (auth)/              # Public auth pages: login, register, forgot/reset password
│   ├── (homepage)/          # Marketing pages: landing, contact, privacy policy
│   └── (protected)/         # All routes that require an authenticated session
│       ├── layout.tsx                    # SSR cookie check → redirect to /login
│       └── (accessHydrated)/
│           ├── layout.tsx               # Client guard: waits for access token hydration
│           ├── workspaces/
│           │   └── [id]/                # Workspace shell with nested routes
│           │       ├── workbenches/[workbenchId]/  # AI workbench detail
│           │       ├── flashcards/[flashcardId]/   # Flashcard set detail + study mode
│           │       ├── quizzes/[quizId]/            # Quiz detail, take, and attempts
│           │       ├── resources/                   # Resource library
│           │       └── settings/                    # Profile and workspace settings
│           └── notifications/           # Notification inbox
│
├── features/                # Feature-sliced vertical modules
│   ├── auth/
│   ├── workspace/
│   ├── workbench/
│   │   ├── chat/            # AI chat (Socket.io streaming)
│   │   └── qa/              # AI question generation
│   ├── flashcards/
│   ├── quizzes/
│   ├── resources/
│   ├── notifications/
│   ├── members/
│   ├── settings/
│   └── landing/
│
├── shared/                  # Cross-feature code
│   ├── providers/           # React context providers (auth, query, socket, theme, workspace-role)
│   ├── components/          # Reusable UI components and file viewers
│   ├── hooks/               # Shared hooks (cookie consent)
│   ├── context/             # Citation context for workbench source linking
│   └── ui/                  # shadcn/ui component wrappers (button, dialog, tabs, etc.)
│
├── lib/                     # Pure utilities and singletons
│   ├── api/
│   │   ├── client.ts        # Axios instances, token store, refresh queue
│   │   └── get-api-error.ts # Error shape normaliser
│   ├── socket/client.ts     # Socket.io singleton with lazy auth callback
│   ├── permissions.ts       # Role-based permission helpers
│   ├── analytics.ts         # Typed Google Analytics event wrappers
│   ├── validations/auth.ts  # Zod schemas for auth forms
│   └── utils.ts             # cn() and other general utilities
│
├── types/                   # Shared TypeScript interfaces
│   ├── api.ts               # ApiSuccess / ApiError envelope types
│   ├── chat.ts              # Message and SourceCitation
│   ├── notification.ts
│   ├── question.ts
│   ├── resource.ts
│   ├── study.ts
│   ├── user.ts
│   └── workbench.ts
│
└── public/                  # Static assets: favicon, OG image, site manifest
```

### Feature Module Layout

Every feature follows the same internal structure:

```
features/<name>/
├── components/   # UI components scoped to this feature
├── queries/      # useQuery hooks (read operations)
├── mutations/    # useMutation hooks (write operations)
├── hooks/        # Derived or composite hooks
├── schemas/      # Zod validation schemas
└── types/        # Feature-local TypeScript types
```

Queries and mutations are separated into distinct files so that callers import only what they need and query key factories stay co-located with the data shape they describe.

---

## Architecture Decisions

### Auth Flow

Authentication uses a short-lived access token stored in JavaScript memory paired with a long-lived refresh token stored in an `httpOnly` cookie set by the backend.

**SSR cookie check (server side)**

The root `app/layout.tsx` reads the `refreshToken` cookie with `next/headers` at request time and passes `hasSession: boolean` to `AuthProvider`. The protected layout (`app/(protected)/layout.tsx`) also reads this cookie server-side and redirects unauthenticated visitors to `/login` before any client JavaScript runs.

**Access token hydration (client side)**

`AuthProvider` (`shared/providers/auth-provider.tsx`) runs a `useEffect` on mount. If `hasSession` is `true` but no in-memory access token exists (e.g. after a hard refresh), it immediately calls `POST /auth/refresh` using `axiosBase` (no auth header required — the cookie is sent automatically). On success it stores the returned access token in the module-level variable inside `lib/api/client.ts` and sets `isAccessTokenHydrated = true`.

**Refresh queue (concurrent requests)**

`axiosPrivate` attaches a `Bearer` header to every outgoing request. Its response interceptor catches `401`/`403` responses. While a token refresh is already in-flight (`isRefreshing = true`), subsequent failing requests are suspended in a `queue` array. Once the refresh resolves, all queued requests are retried with the new token. If the refresh itself fails, the queue is rejected, the in-memory token is cleared, and a global `auth:session-expired` CustomEvent is dispatched so that `AuthProvider` can redirect the user to `/login` and clear the React Query cache.

**Logout**

`POST /api/logout` (a Next.js Route Handler) sets `maxAge: 0` on the `refreshToken` cookie, erasing it from the browser. The `AuthProvider.handleLogout` method calls the backend's logout endpoint, then hits this Route Handler, then clears the in-memory token and the React Query cache.

### Route Protection

Two nested layout groups enforce access:

1. `app/(protected)/layout.tsx` — a **server component** that reads `refreshToken` from cookies. If absent, it calls `redirect("/login")`. This prevents any HTML from being streamed to unauthenticated users.

2. `app/(protected)/(accessHydrated)/layout.tsx` — a **client component** that reads `isAccessTokenHydrated` from `AuthContext`. Until the access token is obtained from the refresh endpoint, it renders a full-page spinner. This prevents API calls from firing before a valid `Bearer` token is available, eliminating a class of 401 race conditions on first load.

### Real-Time (Socket.io)

`lib/socket/client.ts` exports a lazily-created singleton `Socket` connected to the `/chat` namespace. The `auth` option is a callback function rather than a static object; this means the current in-memory access token is evaluated at every (re)connect, so a just-refreshed token is picked up automatically without reinitialising the socket.

`SocketProvider` (`shared/providers/socket-provider.tsx`) mounts the socket only after `isAccessTokenHydrated` is `true`. It handles `io server disconnect` events (which indicate a server-initiated disconnect, usually due to token expiry) by proactively refreshing the token and reconnecting. If the refresh fails it fires the `auth:session-expired` event. The socket is destroyed and nulled when the session expires.

`useChat` (`features/workbench/chat/hooks/use-chat.ts`) manages the chat message list entirely in local state. It handles four socket events:

- `chat:chunk` — appends streamed text to a temporary `STREAMING_ID` message while the AI is generating
- `chat:userMessage` — replaces the optimistic user message with the persisted server message
- `chat:message` — fires after the AI finishes; removes the streaming placeholder and appends the final assistant message
- `chat:error` — clears optimistic messages and inserts an inline error

Outgoing messages are added to the local list optimistically before `socket.emit("chat:sendMessage", ...)` is called. An `optimisticQueue` ref tracks which temporary IDs map to which server-confirmed messages.

### Optimistic Updates

React Query's `onMutate` / `onError` / `onSettled` lifecycle is used for operations where instant UI feedback matters. A representative example is `useMarkRead` (`features/notifications/mutations/use-mark-read.ts`):

```typescript
onMutate: async (id) => {
  await queryClient.cancelQueries({ queryKey: notificationKeys.all() })
  const prev = queryClient.getQueryData<Notification[]>(notificationKeys.all())
  queryClient.setQueryData<Notification[]>(notificationKeys.all(), (old) =>
    old?.map((n) => (n.id === id ? { ...n, is_read: true } : n))
  )
  return { prev }
},
onError: (_err, _id, ctx) => {
  queryClient.setQueryData(notificationKeys.all(), ctx?.prev)
},
```

The pattern is: cancel in-flight queries for the affected key, snapshot the current cache, apply the optimistic change, and return the snapshot as context so `onError` can roll back cleanly.

### Role-Based Permissions

Three roles exist: `owner`, `editor`, and `member`. The helper module `lib/permissions.ts` exports a `can` object with three predicates:

```typescript
can.editContent(role)    // owner or editor
can.adminWorkspace(role) // owner only
can.leaveWorkspace(role) // non-owners only (owners must delete the workspace)
```

The current user's role in a specific workspace is derived by `useMyRoleInWorkspace` (cross-referencing the members list against the authenticated user's profile) and exposed to the component tree via `WorkspaceRoleProvider` / `useWorkspaceRole`. Components use `can.*` at render time to show or hide action buttons and dialogs without relying on string comparisons scattered across the codebase.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the backend API and Socket.io server (e.g. `https://api.example.com`) |
| `NEXT_PUBLIC_APP_URL` | Yes | Public URL of this frontend (used for SEO metadata and sitemap generation) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID for `@react-oauth/google` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Google Analytics 4 measurement ID; analytics only load after cookie consent |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Sentry DSN for client-side error and replay ingestion |

Server-only variables consumed by the Sentry build plugin (`SENTRY_ORG`, `SENTRY_PROJECT`) are not prefixed with `NEXT_PUBLIC_` and are not exposed to the browser.

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.3.10
- A running instance of the Nextudy backend (or a mock)

### Install

```bash
bun install
```

### Configure

Copy the example environment file and fill in the values:

```bash
cp .env.example .env.local
```

Set at minimum:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-client-id>
```

### Run Development Server

```bash
bun dev
```

The app starts on `http://localhost:3001` with Turbopack. `react-scan` is injected automatically in development to highlight unnecessary re-renders.

### Type Check

```bash
bun typecheck
```

### Lint and Format

```bash
bun lint
bun format
```

### Production Build

```bash
bun build
bun start
```

---

## Feature Modules

### auth

Email/password login and registration with Zod-validated forms. Google OAuth via `@react-oauth/google`. Forgot password and reset password flows. On successful login the access token is written into the in-memory store, `markSessionActive` is called on `AuthProvider`, and the user is navigated to `/workspaces`.

### workspace

Workspace CRUD (create, rename, delete). Member management: invite by email, change roles, remove members. The workspace layout (`app/(protected)/(accessHydrated)/workspaces/[id]/layout.tsx`) wraps every workspace page in `WorkspaceRoleProvider` so role-gated UI is available without prop drilling.

### workbench

An AI study session within a workspace. A workbench holds a curated set of resources and exposes two panels — the AI chat and the Q&A generator — alongside a resource preview panel. The layout supports toggling between split and full-panel views.

**Chat sub-feature** (`features/workbench/chat/`): Real-time AI conversation driven by Socket.io streaming. Supports message editing; edited messages re-trigger the AI response chain from that point.

**Q&A sub-feature** (`features/workbench/qa/`): Generates multiple-choice and open-ended questions from selected resources. Questions can be regenerated individually, edited in place, and exported to PDF.

### resources

File upload (PDF, DOCX, TXT, images) to a workspace via `multipart/form-data`. The resource viewer (`shared/components/file-viewer/`) renders PDFs natively, converts DOCX to HTML using mammoth, and displays plain text and images inline. Resources can be attached to workbenches and used as Q&A or flashcard sources.

### flashcards

Flashcard sets are generated from workspace resources using AI or created manually. Each set contains front/back card pairs. The study tab presents a flippable card interface. Cards can be edited and deleted individually.

### quizzes

Quizzes are assembled from questions stored in the workspace (generated via the Q&A workbench tool). Users take a quiz in a focused view, and completed attempts are saved with per-question scoring. Past attempts are listed with a score breakdown and correct answer review.

### notifications

Inbox for workspace invitations and system events. Invitations can be accepted or declined directly from the notification card. Marking a notification as read is an optimistic update so the UI responds immediately.

### landing

Public marketing pages: hero, feature highlights, how-it-works, testimonials, CTA, and a contact form. Includes a privacy policy page. Google Analytics events are emitted for CTA clicks and contact form submission, gated behind cookie consent.

### settings

Profile management (name, email, password) and workspace settings (rename, delete, member management). Mirrors the workspace member management UI within the settings section.

---

## Deployment

### Docker

The `Dockerfile` uses a three-stage build:

1. **deps** (`oven/bun:1.3.10-alpine`) — installs dependencies from the lockfile with `--frozen-lockfile`.
2. **builder** (`oven/bun:1.3.10-alpine`) — runs `bun run build` to produce a Next.js standalone output.
3. **runner** (`node:20-alpine`) — copies only the standalone bundle, static assets, and public directory. Runs as a non-root `nextjs` user. The final image has no Bun or node_modules overhead.

```bash
docker build -t nextudy-frontend .
docker run -p 3001:3001 \
  -e NEXT_PUBLIC_API_URL=https://api.example.com \
  -e NEXT_PUBLIC_APP_URL=https://example.com \
  -e NEXT_PUBLIC_GOOGLE_CLIENT_ID=... \
  nextudy-frontend
```

### Next.js Standalone Output

`next.config.mjs` sets `output: "standalone"`. This bundles only the files required to run the server, keeping the final image small. The `canvas` module is aliased to an empty module stub (`empty-module.js`) in both webpack and Turbopack configurations to prevent build failures from the PDF viewer's native dependency.

### Sentry

Sentry is initialised in three separate entry points: `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts`. Session replay is enabled with a 10 % sampling rate in normal operation and 100 % on errors. Source maps are uploaded during CI builds when `SENTRY_ORG` and `SENTRY_PROJECT` are set.
