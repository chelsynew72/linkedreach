# LinkedReach 

A full-stack LinkedIn automation platform inspired by HeyReach — built with **Next.js 14** (frontend) and **NestJS** (backend).

---

## ✨ Features

-  **JWT Auth** — register / login / protected routes
-  **Multi-Account Management** — connect unlimited LinkedIn accounts with daily limits, proxy support, and live status
-  **Campaign Builder** — drag-and-drop sequence builder with connection requests, messages, profile views, follows, and delays
-  **Lead Management** — CSV import, per-lead status tracking, activity log, pagination
-  **Puppeteer Automation** — stealth browser sessions, human-like delays, round-robin account rotation, Bull queue with rate limiting
-  **Unified Inbox** — all LinkedIn messages from all accounts in one place
-  **Analytics** — dashboard KPIs, 30-day trend charts, campaign funnel breakdown
-  **Settings** — profile, notifications, security, billing plans
-  **Docker Compose** — one command to spin up Postgres + Redis + API + UI

---

##  Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, React Query, Zustand, Recharts |
| Backend | NestJS, TypeORM, Bull/Redis, Passport JWT |
| Automation | Puppeteer + puppeteer-extra-plugin-stealth |
| Database | PostgreSQL |
| Queue | Redis + Bull |
| Lint | ESLint + @typescript-eslint (both apps) |

---

##  Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL running locally (or use Docker)
- Redis running locally (or use Docker)

### Option A — Docker (recommended)

```bash
# Copy env files
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Start everything
docker-compose up -d
```

App: http://localhost:3000  
API: http://localhost:3001  
Swagger: http://localhost:3001/api/docs

---

### Option B — Manual

**Backend:**
```bash
cd backend
cp .env.example .env          # fill in your DB + Redis details
npm install
npm run start:dev
```

**Frontend:**
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

---

##  Project Structure

```
linkedreach/
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── auth/             # JWT auth (login, register)
│   │   ├── users/            # User entity & service
│   │   ├── accounts/         # LinkedIn account management
│   │   ├── campaigns/        # Campaign CRUD & sequences
│   │   ├── leads/            # Lead import & tracking
│   │   ├── inbox/            # Unified message inbox
│   │   ├── analytics/        # Stats & reporting
│   │   └── automation/       # Puppeteer engine + Bull queue
│   ├── .eslintrc.json
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                 # Next.js 14 App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/       # Login & Register pages
│   │   │   └── (dashboard)/  # All protected pages
│   │   ├── lib/              # API client, auth store, utils
│   │   └── types/            # Shared TypeScript interfaces
│   ├── .eslintrc.json
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml
```

---

##  Linting

```bash
# Frontend
cd frontend
npm run lint          # check
npm run lint:fix      # auto-fix
npm run type-check    # TypeScript check

# Backend
cd backend
npm run lint:check    # check
npm run lint          # auto-fix
npm run type-check    # TypeScript check
```

---

##  Important Notes

1. **LinkedIn ToS** — Browser automation violates LinkedIn's Terms of Service. Use responsibly and at your own risk.
2. **Proxies** — Assign a dedicated residential proxy per LinkedIn account to reduce ban risk.
3. **Daily Limits** — Defaults are 20 connections/day and 50 messages/day per account. Stay conservative.
4. **Session Cookies** — Stored encrypted in the database. Avoid logging in too frequently.
5. **Puppeteer on Linux** — The backend Dockerfile installs Chromium. For local macOS/Windows, Puppeteer auto-downloads Chromium.

---

 API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/users/me | Get profile |
| GET | /api/accounts | List LinkedIn accounts |
| POST | /api/accounts | Add account |
| POST | /api/automation/accounts/:id/login | Connect via Puppeteer |
| GET | /api/campaigns | List campaigns |
| POST | /api/campaigns | Create campaign |
| PATCH | /api/campaigns/:id/status | Update status |
| GET | /api/campaigns/:id/leads | List leads |
| POST | /api/campaigns/:id/leads/import | Import leads |
| POST | /api/automation/campaigns/:id/start | Queue automation jobs |
| GET | /api/inbox/conversations | List conversations |
| GET | /api/analytics/dashboard | Dashboard stats |

Full interactive docs at: `http://localhost:3001/api/docs`
