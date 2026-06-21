# Anantastro — Production Launch Readiness Audit

**Date:** 21 June 2026  
**Scope:** Full platform audit — frontend (`app/`), backend (`backend/`), deployment, security, compliance, and operational readiness  
**Audience:** Founders, engineering, ops, legal

---

## Executive Summary

Anantastro is a **Vedic astrology platform** with kundli generation, horoscope, matchmaking, AI astrologer chat, and a coin-based wallet (Razorpay). The **core product flows are largely implemented** and wired end-to-end. The platform is **not yet launch-ready** without addressing legal/compliance gaps, security hardening, placeholder content, and operational safeguards.

| Area | Readiness | Notes |
|------|-----------|-------|
| Kundli / horoscope / matchmaking | **Ready** | Generate → result → share; coin debit; Bull queues |
| AI astrologer chat | **Ready** | Realtime billing, OpenAI replies, WebSocket |
| Coin wallet & Razorpay | **Ready** | Checkout + webhook idempotency |
| Auth (email + Google) | **Mostly ready** | No password reset; JWT hardening needed |
| Human astrologer onboarding | **Form only (Phase 2)** | Application + admin review exist; **no public human marketplace** |
| Legal / compliance pages | **Not ready** | Privacy, terms, refund → 404 |
| Security | **Needs work** | Default secrets, media ACL, rate limits, public AI abuse |
| Ops / CI/CD | **Weak** | Manual deploy only; no pre-deploy tests |
| Test coverage (business paths) | **Low** | Strong astrology engine tests; weak auth/payment/chat tests |

**Recommendation:** Treat launch as a **soft launch** only after P0 items are complete. Human astrologer marketplace and live human consultation are explicitly **out of scope** for this launch (onboarding form collects applications; admin approval exists; consumer directory shows **AI astrologers only**).

---

## Platform Architecture

```
┌─────────────────┐     HTTPS      ┌─────────────────┐
│  Next.js 16     │ ──────────────▶│  NestJS 11 API  │
│  (EC2 Docker)   │   /api proxy   │  (EC2 Docker)   │
│  Redux RTK Q    │                │  Sequelize/MySQL│
│  Socket.IO cli  │◀──────────────▶│  Redis/BullMQ   │
└─────────────────┘   WebSocket    │  Socket.IO srv  │
                                   └────────┬────────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    ▼                       ▼                       ▼
              Razorpay              OpenAI API              Google Maps
              (payments)            (AI chat/kundli)        (geocode/TZ)
                    │
              SMTP (email)
              S3 or local uploads
              Swiss Ephemeris (kundli engine)
```

| Layer | Stack |
|-------|-------|
| Frontend | Next.js 16, React 19, Redux Toolkit Query, next-intl, Tailwind 4, Razorpay JS, Socket.IO client |
| Backend | NestJS 11, Express, MySQL (Sequelize), Redis/BullMQ, Passport JWT, Socket.IO |
| Deploy | Docker standalone on EC2; GitHub Actions `workflow_dispatch` (manual SSH deploy) |
| Payments | Razorpay (order → verify + webhook) |
| AI | OpenAI `gpt-4.1-mini` for chat and kundli interpretation |

---

## User Flows — Status Matrix

### P0 — Revenue & core product (must work at launch)

| Flow | Route(s) | Backend | Status | Gaps |
|------|----------|---------|--------|------|
| Register | `/auth/register` | `POST /api/auth/register` | ✅ | Email verification required |
| Login | `/auth/login` | `POST /api/auth/login` | ✅ | No forgot-password |
| Google OAuth | `/auth/google/callback` | `GET /api/auth/google/callback` | ✅ | JWT in URL query string (security risk) |
| Email verify | `/auth/verify-email` | `POST /api/auth/verify-email` | ✅ | — |
| Kundli generate | `/services/kundli/generate` | `POST /api/kundli` | ✅ | Hero form data in Redux only (lost on refresh) |
| Kundli result | `/services/kundli/result/[id]` | `GET /api/kundli/:uuid` | ✅ | Polls generation status |
| Kundli share | `/services/kundli/share/[token]` | `GET /api/kundli/share/:token` | ✅ | Public; depends on token entropy |
| Horoscope | `/services/horoscope/*` | `/api/horoscope/*` | ✅ | — |
| Matchmaking | `/services/matchmaking/*` | `/api/matchmaking/*` | ✅ | — |
| Buy coins | `/pricing` → Razorpay | `POST /api/coins/checkout/*` | ✅ | Needs live Razorpay keys + webhook URL |
| Wallet | `/wallet` | `GET /api/coins/me/*` | ✅ | Realtime balance via Socket.IO |
| AI chat | `/astrologers` → `/chat/[id]` | `/api/chat/*` + WS `/chat` | ✅ | Per-minute billing; ends on insufficient coins |
| Profile / kundli profiles | `/profile` | `/api/kundlis`, `/api/auth/profile` | ✅ | — |

### P1 — Admin & operations

| Flow | Route(s) | Status | Gaps |
|------|----------|--------|------|
| Admin dashboard | `/admin` | ✅ | JWT role not re-fetched from DB |
| User management | `/admin/users` | ✅ | Impersonation issues full user JWT |
| Coin admin | `/admin/coins/*` | ✅ | — |
| AI astrologer admin | `/admin/ai-astrologers` | ✅ | — |
| Kundli support metadata | `/admin/kundli-support` | ✅ | Internal calculation metadata |
| Astrologer request review | `/admin/astrologer-requests` | ✅ | Approve/reject applications |

### P2 — Human astrologer (next phase — **not launch scope**)

| Flow | Route(s) | Status | Notes |
|------|----------|--------|-------|
| Application form | `/astrologer/register` | ✅ Form wired | Uploads KYC, `POST /api/astrologer-requests` |
| Application success | `/astrologer/register/success` | ✅ | — |
| Admin approve → astrologer role | `/admin/astrologer-requests` | ✅ | Creates astrologer profile on approve |
| Astrologer dashboard | `/astrologer/*` | ✅ | Profile, services pricing, settings |
| **Public human astrologer directory** | — | ❌ | `/astrologers` lists **AI only** |
| **Human live consultation / chat** | — | ❌ | Chat system is AI personas only |
| Profile views analytics | `/astrologer` | ❌ | Hardcoded `0`; TODO in code |

### Broken / placeholder / non-functional

| Item | Location | Severity |
|------|----------|----------|
| Privacy policy page | Footer → `/privacy` | **P0** — 404 |
| Terms of service | Footer → `/terms` | **P0** — 404 |
| Refund policy | Footer → `/refund` | **P0** — 404 (required for Razorpay) |
| Contact form | `components/contact/ContactMainSection.tsx` | **P0** — `preventDefault()` only, no API |
| Placeholder phone/address | `Footer.tsx`, Contact | **P0** — `+1 (555) 123-4567`, fake address |
| Generic social URLs | `Footer.tsx` | **P1** — facebook.com, twitter.com, etc. |
| `/services/ai-reports` | Footer, 404 page | **P1** — 404 |
| "Live Consultation" footer link | Footer → `/contact` | **P1** — Misleading label |
| Account deactivated banner | `?error=account_deactivated` | **P1** — Redirect exists; no homepage UI |
| Password reset | — | **P1** — Email template exists; no API |
| User self-delete account | — | **P2** — Admin soft-delete only |
| Forgot password link on login | — | **P1** — Not implemented |

---

## Priority Action List

### P0 — Launch blockers (do not go live without these)

1. **Legal pages** — Create `/privacy`, `/terms`, `/refund` with real copy (India: IT Act, consumer protection, Razorpay refund policy).
2. **Replace all placeholder contact info** — Real phone, address, support email in Footer and Contact.
3. **Production secrets** — Strong `JWT_SECRET`, `RAZORPAY_*`, `OPENAI_API_KEY`, `GOOGLE_MAPS_API_KEY`; **fail startup if JWT_SECRET is default**.
4. **Disable default admin seeder in production** — Never run `SEED_ON_STARTUP=true` with `admin@anantastro.com` / `admin123`.
5. **Razorpay production setup** — Live keys, webhook `https://<api>/api/payments/razorpay/webhook`, test end-to-end purchase.
6. **Fix or remove contact form** — Wire to email/API or remove "Send Message" until ready.
7. **Media access control** — KYC documents (Aadhar/PAN) must not be readable by any authenticated user with UUID.
8. **Rate limiting** — At minimum: login, register, translate, public simplify, share-token AI endpoints.

### P1 — High priority (first week of launch)

9. **OAuth token handling** — Stop passing JWT in URL; use one-time code exchange or POST redirect.
10. **JWT storage** — Move from `localStorage` to httpOnly cookies (or short-lived access + refresh).
11. **Password reset flow** — `POST /api/auth/forgot-password` + `reset-password` (template already exists).
12. **WebSocket CORS** — Restrict `origin: '*'` to `FRONTEND_URL` on `/chat` and `/realtime`.
13. **Swagger in production** — Disable or protect `/api/doc`.
14. **Admin guard** — Re-fetch role from DB (like `AstrologerGuard`) to prevent stale admin JWT.
15. **Account deactivated UX** — Banner on homepage when `?error=account_deactivated`.
16. **Fix broken footer links** — Remove or implement `/services/ai-reports`; relabel "Live Consultation".
17. **CI gate before deploy** — `npm run build`, `npm test`, `npm run lint` on both repos.
18. **Real social media URLs** — Or remove icons until accounts exist.
19. **Security headers** — Add `helmet` on backend; CSP on frontend.
20. **Reduce Razorpay webhook logging** — Log event type + order ID only, not full payload.

### P2 — Post-launch / next phase

21. **Human astrologer marketplace** — Public directory, booking, human chat/video (currently AI-only).
22. **Astrologer profile views** — Analytics for approved astrologers.
23. **User account deletion (self-service)** — GDPR/DPDP-style data rights.
24. **Refresh tokens / JWT revocation** — Logout and compromise response.
25. **Observability** — Structured logging, error tracking (Sentry), uptime monitoring, alerts.
26. **Database backups** — Automated MySQL backups + restore drill.
27. **Full i18n UX** — 13 locales in routing; language switcher only shows `en` + `hi`.
28. **E2E test suite** — Auth, checkout, kundli generation, chat billing.
29. **Marketing visual polish** — See `screenshots/marketing/VISUAL_AUDIT.md` (contrast, card consistency, mobile).
30. **Contact / live chat** — Real support channel if advertised.

---

## Security Risk Register

| ID | Severity | Risk | Location | Impact | Mitigation |
|----|----------|------|----------|--------|------------|
| SEC-01 | **CRITICAL** | Default JWT secret fallback `'your-secret-key'` | `backend/src/auth/auth.module.ts`, `jwt.strategy.ts`, WebSocket gateways | Anyone can forge tokens | Fail startup if unset in production; remove fallback |
| SEC-02 | **CRITICAL** | Default admin `admin123` via seeder | `backend/src/database/seeders/20260101174031-create-admin-user.js` | Full admin compromise | Never seed in prod; env-based bootstrap; force password change |
| SEC-03 | **HIGH** | KYC media accessible without ownership check | `backend/src/media/media.controller.ts` | Any logged-in user can fetch Aadhar/PAN by UUID | Enforce `media.userId === req.user.id` or admin |
| SEC-04 | **HIGH** | No API rate limiting | Entire backend | Brute force, abuse, cost explosion | `@nestjs/throttler` + edge WAF |
| SEC-05 | **HIGH** | Public OpenAI proxy endpoints | `POST /api/translate`, `POST /api/kundli/share/:token/simplify` | Unlimited OpenAI spend | Auth or strict rate limits + text length caps |
| SEC-06 | **HIGH** | JWT in OAuth redirect URL | `auth.controller.ts`, `app/.../google/callback` | Token leakage via logs, referrer | One-time exchange code |
| SEC-07 | **HIGH** | WebSocket CORS `origin: '*'` | `chat.gateway.ts`, `realtime.gateway.ts` | Cross-origin WS abuse | Restrict to `FRONTEND_URL` |
| SEC-08 | **MEDIUM** | JWT in localStorage | `app/lib/auth.ts` | XSS → token theft | httpOnly cookies |
| SEC-09 | **MEDIUM** | Admin JWT trusts stale role | `admin/guards/admin.guard.ts` | Demoted admin retains access until expiry | DB role check |
| SEC-10 | **MEDIUM** | Swagger publicly exposed | `main.ts` → `/api/doc` | API surface enumeration | Disable in prod |
| SEC-11 | **MEDIUM** | Admin impersonation long-lived JWT | `admin.controller.ts` | Audit/compliance risk | Short-lived tokens + audit log |
| SEC-12 | **MEDIUM** | `dangerouslySetInnerHTML` for chart SVG | `KundliResultContent.tsx` | XSS if backend SVG unsanitized | Sanitize server-side; CSP |
| SEC-13 | **MEDIUM** | No security headers (helmet/CSP) | `main.ts`, `next.config.ts` | Clickjacking, MIME sniffing | Add helmet + CSP |
| SEC-14 | **MEDIUM** | Debug logging of user objects | `auth.service.ts` | PII in logs | Strip in production |
| SEC-15 | **MEDIUM** | `CHAT_WEBHOOK_SECRET` undocumented | `.env.example` | Misconfiguration | Document + require in prod |
| SEC-16 | **LOW** | JWT not revocable | Stateless JWT | Stolen token valid until expiry | Blocklist or short TTL |
| SEC-17 | **LOW** | Share tokens expose full chart | Public share endpoints | Data exposure if token guessed | UUID tokens; optional expiry |
| SEC-18 | **LOW** | Client-only route guards | `ProtectedRoute.tsx` | Flash of protected content | Middleware auth (optional) |
| SEC-19 | **LOW** | Local upload static serving | `main.ts` `/api/uploads/` | Path traversal if misconfigured | S3 in production; validate paths |

### Security practices already in place

- Global `ValidationPipe` with whitelist + `forbidNonWhitelisted`
- Razorpay webhook: raw body + HMAC signature verification
- Chat webhook: HMAC + timestamp window + `timingSafeEqual`
- Sequelize parameterized queries (no raw SQL injection in app code)
- Payment idempotency keys for wallet credits and chat billing ticks
- Email verification required before local login
- bcrypt password hashing
- File upload limits: 5MB, JPEG/PNG/PDF only

---

## Compliance & Legal

| Requirement | Status | Action |
|-------------|--------|--------|
| Privacy Policy | ❌ Missing (404) | Draft covering: data collected (birth data, KYC for astrologers), OpenAI processing, cookies, retention |
| Terms of Service | ❌ Missing (404) | User obligations, coin terms, AI disclaimer, jurisdiction |
| Refund Policy | ❌ Missing (404) | **Required for Razorpay** — coin purchase refunds, service failures |
| AI disclosure | ⚠️ Partial | Clarify AI astrologers are not human; no medical/legal/financial advice |
| KYC data (astrologer applications) | ⚠️ At risk | Aadhar/PAN storage + access control (SEC-03) |
| DPDP / data rights (India) | ❌ Not implemented | Self-service export/delete not available |
| Cookie consent | ❌ Not implemented | If analytics added later |
| GST / invoicing for coin purchases | ❓ Unknown | Confirm with finance/legal for Razorpay receipts |

---

## Infrastructure & Operations

### Deployment (current state)

| Item | Frontend | Backend |
|------|----------|---------|
| Platform | EC2 Docker | EC2 Docker |
| CI/CD | `.github/workflows/deploy.yml` | `.github/workflows/deploy.yml` |
| Trigger | Manual `workflow_dispatch` only | Manual `workflow_dispatch` only |
| Pre-deploy tests | ❌ None | ❌ None |
| Migrations | N/A | Optional `MIGRATE_ON_STARTUP=true` |
| Seeds | N/A | Optional `SEED_ON_STARTUP=true` (**dangerous in prod**) |
| Health check | Docker `:3000` | Docker `:3001/api` |
| `git pull \|\| true` | ⚠️ Swallows failures | ⚠️ Swallows failures |

### Production environment checklist

#### Backend (`.env`)

| Variable | Required | Notes |
|----------|----------|-------|
| `NODE_ENV=production` | ✅ | |
| `JWT_SECRET` | ✅ | Strong random; no default |
| `DB_*` | ✅ | MySQL connection |
| `REDIS_HOST/PORT` | ✅ | Bull queues + translation cache |
| `FRONTEND_URL` | ✅ | CORS origin |
| `BASE_URL` | ✅ | OAuth callbacks, email links |
| `GOOGLE_CLIENT_ID/SECRET/CALLBACK_URL` | ✅ | OAuth |
| `GOOGLE_MAPS_API_KEY` | ✅ | Geocode + timezone at birth date |
| `OPENAI_API_KEY` | ✅ | Chat + kundli AI |
| `RAZORPAY_KEY_ID/SECRET/WEBHOOK_SECRET` | ✅ | Live mode for production |
| `SMTP_*`, `EMAIL_FROM` | ✅ | Verification emails |
| `SWEPH_EPHE_PATH` | ✅ | Swiss Ephemeris (auto-download in entrypoint) |
| `REQUIRE_SWEPH=true` | Recommended | No Moshier fallback in prod |
| `STORAGE_TYPE=s3` | Recommended | KYC docs should not be on local disk in prod |
| `AWS_*`, `S3_*` | If S3 | |
| `LIBRETRANSLATE_URL` | Optional | Falls back to original text |
| `CHAT_WEBHOOK_SECRET` | If webhooks used | Not in `.env.example` — add |
| `MIGRATE_ON_STARTUP=true` | Recommended | Run migrations on deploy |
| `SEED_ON_STARTUP` | **Never in prod** | Creates default admin |

#### Frontend

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_API_URL` | ✅ at build | Backend URL or empty for same-origin `/api` proxy |

### Missing operational capabilities

- **No automated backups** documented for MySQL
- **No centralized logging** (Morgan HTTP logs only)
- **No APM / error tracking** (Sentry, Datadog, etc.)
- **No uptime monitoring** or alerting
- **No staging environment** referenced in deploy workflows
- **No rollback procedure** documented
- **No SSL/TLS config** in repo (assumed nginx/reverse proxy on EC2)
- **No DDoS/WAF** layer documented

---

## API Surface Summary

All routes prefixed with `/api`. Auth: **Public** | **JWT** | **Admin** | **Astrologer**.

| Module | Key endpoints | Auth |
|--------|---------------|------|
| Auth | register, login, verify-email, google, profile, change-password | Mixed |
| Kundlis | CRUD profiles | JWT |
| Kundli generation | create, get, share, simplify | JWT / Public (share) |
| Horoscope / Matchmaking | create, get, share | JWT / Public (share) |
| Geocode | geocode, suggestions, timezone | JWT |
| Upload / Media | upload, get by UUID | JWT (**ACL gap**) |
| Coins | plans, wallet, checkout, verify | Mixed |
| Payments | Razorpay webhook | HMAC signature |
| Chat | astrologers, sessions, messages | Mixed |
| Astrologer requests | submit, admin review | JWT / Admin |
| Astrologer profiles | my-profile, admin | Astrologer / Admin |
| Admin | users, impersonate, dashboard, kundli metadata | Admin |
| Translate | translate, languages | **Public** |
| WebSocket | `/chat`, `/realtime` | JWT in handshake |

Full Swagger: `/api/doc` (should be disabled in production).

---

## Astrologer Onboarding — Scope Clarification

### In scope for this launch

1. **Application form** (`/astrologer/register`) — 4-step wizard:
   - Personal info, expertise, documents (Aadhar/PAN upload via `POST /api/upload`)
   - Submits `POST /api/astrologer-requests`
2. **Success page** (`/astrologer/register/success`)
3. **Admin review** (`/admin/astrologer-requests`) — approve, reject, allow reapply
4. **On approve** — user role → `astrologer`, profile created
5. **Astrologer dashboard** (`/astrologer/*`) — profile, service pricing, settings (for approved astrologers)

### Explicitly next phase (not launch)

- Listing approved **human** astrologers on the public `/astrologers` page (currently **AI personas only**)
- Human live consultation, booking, or chat
- Consumer discovery of human astrologers by expertise/rating
- Profile view analytics
- Payout/settlement for human astrologers

**Messaging recommendation:** Label `/astrologers` clearly as "AI Astrologers" in UI copy. Do not imply human live consultation is available.

---

## Test Coverage

### Backend

| Area | Coverage | Notes |
|------|----------|-------|
| Kundli engine (D-1, Navamsa, KP, dasha, transit, divisionals, yogas) | **Strong** | Benchmark gates in CI (`validate:astro`) |
| AI prompt building | Partial | Unit specs exist |
| Auth, payments, chat, admin | **None** | Critical gap |
| E2E | Broken | `test/app.e2e-spec.ts` expects "Hello World" |

### Frontend

| Area | Coverage | Notes |
|------|----------|-------|
| Motion presets, report text | Minimal | Vitest |
| Reduced motion smoke | 4 routes | Playwright, not in CI |
| Auth, payments, chat, kundli | **None** | |

### Recommended minimum pre-launch tests

1. Register → verify email → login
2. Create kundli profile → generate kundli → view result
3. Purchase coins (Razorpay test mode) → verify wallet credit
4. Start AI chat → send message → verify coin debit
5. Astrologer application submit → admin approve
6. Share link access (public, no auth)

---

## Coin Economy Reference

Default service costs (configurable via admin):

| Service | Default coins |
|---------|---------------|
| Kundli generation | 10 |
| Horoscope | 10 |
| Matchmaking | 15 |
| Chat (per minute) | 5 |

Signup bonus granted on registration. Insufficient coins block service start and end chat sessions.

---

## Existing Internal Audits (reference)

| Document | Focus |
|----------|-------|
| `screenshots/marketing/VISUAL_AUDIT.md` | Marketing UI — contrast, placeholders, broken links |
| `DESIGN_AUDIT.md` | Full route inventory, design system gaps |
| `DESIGN_SYSTEM.md` | Brand tokens, component patterns |
| `backend/docs/parity-audit-plan.md` | Kundli calculation parity |
| `backend/CONTEXT.md` | Domain language for kundli engine |

Authenticated surfaces (wallet, chat, admin, kundli results) have **not** had a dedicated visual/UX audit yet.

---

## Launch Checklist (copy for ops)

### One week before

- [ ] P0 security fixes deployed (JWT, media ACL, rate limits)
- [ ] Legal pages live with counsel-reviewed copy
- [ ] Placeholder contact info replaced
- [ ] Razorpay live mode + webhook tested
- [ ] Production env vars set (no default secrets)
- [ ] `SEED_ON_STARTUP=false`; admin password changed
- [ ] `MIGRATE_ON_STARTUP=true` verified
- [ ] SMTP sending verification emails in prod
- [ ] OpenAI billing alerts configured
- [ ] Google Maps API key restricted by IP/referrer
- [ ] S3 bucket private; presigned URLs for KYC
- [ ] Swagger disabled in production
- [ ] SSL certificates valid
- [ ] Database backup job scheduled

### Launch day

- [ ] Deploy backend → run migration status check
- [ ] Deploy frontend with correct `NEXT_PUBLIC_API_URL`
- [ ] Smoke test: register, kundli, buy coins, chat
- [ ] Monitor error logs and Razorpay dashboard
- [ ] Support email monitored

### First 48 hours

- [ ] Watch OpenAI spend (public simplify/translate abuse)
- [ ] Watch failed payment webhooks
- [ ] Review astrologer applications queue
- [ ] Collect user feedback on coin pricing clarity

---

## Summary: Go / No-Go

| Decision | Criteria |
|----------|----------|
| **NO-GO (current)** | Legal pages missing, placeholder content live, critical security gaps (SEC-01–03), no rate limiting |
| **SOFT GO** | P0 complete + Razorpay live + real support contact + smoke tests pass |
| **FULL GO** | P0 + P1 complete + monitoring + backups + password reset |

Human astrologer marketplace remains a **separate launch milestone** after the onboarding form and admin workflow already in place.

---

*Generated from codebase audit on 21 June 2026. Re-run this audit after major releases or before payment/compliance changes.*
