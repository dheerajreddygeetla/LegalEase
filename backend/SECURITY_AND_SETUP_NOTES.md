# Backend Hardening Notes

This backend was audited and enhanced for security, robustness, and
production-readiness. This file summarizes what changed and what you need
to do to run it.

## Setup

1. `cd backend && npm install` — installs the new dependencies (`helmet`,
   `compression`, `morgan`, `express-rate-limit`, `express-mongo-sanitize`,
   `express-validator`, `google-auth-library`) alongside the existing ones.
2. Copy `.env.example` to `.env` and fill in real values. New variables:
   - `JWT_SECRET` — must now be at least 16 characters; the server refuses
     to start with a short/missing secret (no more insecure default).
   - `GOOGLE_CLIENT_ID` — required for `POST /api/auth/google` to work at
     all. Without it, that endpoint returns 503 instead of silently
     accepting unverified logins.
   - `CORS_ORIGINS` — comma-separated list of frontend origins allowed to
     call the API. Defaults to the local Vite dev server.
   - `MAX_UPLOAD_MB`, `RATE_LIMIT_*` — tunable limits, sensible defaults
     provided.
3. `npm run dev` (or `npm start`) as before.

## Breaking changes to be aware of

- **`GET /uploads/<filename>` no longer works.** Uploaded documents were
  previously served as a public static directory — anyone with (or
  guessing) a filename could download another user's document with no
  authentication. Files are now only reachable via
  `GET /api/documents/:id/file`, which requires a valid JWT and checks that
  the requesting user owns the document. If the frontend links directly to
  `/uploads/...` URLs, update it to fetch this endpoint instead (with the
  `Authorization: Bearer <token>` header).
- **`POST /api/auth/google` now expects `{ idToken }`**, not `{ name, email }`.
  The frontend must send the real Google-issued ID token (from Google
  Identity Services / `@react-oauth/google`, etc.) so it can be verified
  server-side. The previous version trusted whatever email the client
  claimed, which allowed logging into any existing account.
- Error responses are now consistently `{ success: false, message, ... }`
  with correct HTTP status codes (400 for bad input/bad IDs, 401 for auth
  issues, 404 for missing resources, 409 for conflicts/duplicates, 429 for
  rate limiting, 503 for AI service issues) instead of many paths
  collapsing to 500.
- List endpoints (`GET /api/schemes`, `GET /api/documents`,
  `GET /api/chat/conversations`) are now paginated and return a
  `pagination: { page, limit, total, totalPages }` object alongside `data`.
  Default page size is generous (20–50) so existing frontend code that
  ignores pagination and just reads `data` will keep working unchanged.

## Security fixes

| Issue | Before | After |
|---|---|---|
| Google login | Trusted client-supplied email/name, no verification — full account-takeover | Verifies real Google ID token server-side via `google-auth-library` |
| Uploaded files | Served publicly via static `/uploads`, no auth | Streamed only via authenticated, ownership-checked route |
| JWT secret | Fell back to hardcoded `'secretkey123'` if unset | Required at boot; server exits with a clear error if missing/weak |
| Mongo URI | Logged in full (including credentials) on every boot | Credentials masked before logging |
| Brute force | No rate limiting on login/register | Rate-limited (default 20 attempts / 15 min / IP) |
| AI cost abuse | No limit on chat/document-analysis calls | Rate-limited separately (default 30 / 15 min / IP) |
| NoSQL injection | No sanitization of request bodies/queries | `express-mongo-sanitize` strips `$`/`.` operator keys |
| Regex injection (ReDoS) | Scheme search (`q`, `ministry`) built raw regex from user input | User input is regex-escaped before use |
| Response headers | No `helmet` | `helmet()` sets standard security headers |
| CORS | Wide open (`cors()` with no restriction) | Restricted to a configurable origin whitelist |

## Robustness fixes

- Centralized error handler correctly maps Mongoose `CastError` (bad
  ObjectId), `ValidationError`, duplicate-key (`11000`), JWT errors, and
  Multer errors to appropriate status codes instead of generic 500s.
- Consistent `asyncHandler` + `ApiError` pattern across all controllers —
  no more copy-pasted try/catch blocks.
- Account deletion now also removes the user's uploaded files from disk
  (previously only removed database records, orphaning files).
- Graceful shutdown on `SIGINT`/`SIGTERM`: stops accepting new connections
  and closes the MongoDB connection cleanly.
- MongoDB connection now logs lifecycle events (error/disconnected/
  reconnected) and uses a bounded server-selection timeout instead of
  hanging indefinitely if the DB is unreachable.
- Added indexes on `Document`, `Conversation`, and `Message` for the
  query patterns actually used (`userId + createdAt`,
  `conversationId + createdAt`).
- Removed a hardcoded, non-functional `encryptionStatus: "AES-256 Active"`
  field from `GET /api/users/stats` (it made a claim about the system that
  wasn't actually true — nothing was AES-256 encrypting user data).
- Upload validation now checks MIME type in addition to file extension,
  since extension alone is trivially spoofable.
