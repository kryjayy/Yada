# Yada

> *To know.*

Yada is a mobile-first emotional check-in and self-awareness app for young people aged 18-22. Built as a full stack portfolio project, it combines psychology-backed daily check-ins with AI-generated personalised reflections to help users understand what they are feeling — and feel less alone in it.

The name comes from the Hebrew word for intimate knowing. Not knowing *about* someone, but knowing them deeply, personally, completely. That is what the app is for.

---

## What it does

Yada's core loop is simple:

1. **Check in** — answer three conversational questions about your sleep, what's on your mind, and how calm you feel
2. **Receive a reflection** — Claude AI reads your answers and responds like a close friend, not a therapist
3. **Write** — a journal space opens after every reflection so you can respond to what was said
4. **Come back** — patterns emerge over time, helping you understand yourself better than you did before

A crisis mode is always one tap away. It never logs data without consent, always shows a Samaritans number, and puts grounding before anything else.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Spring Boot (Java 17) |
| Database | PostgreSQL |
| AI | Claude API (claude-sonnet-4-6) |
| Auth | JWT |
| Deployment | Vercel (frontend), Render (backend), Supabase (DB) |

---

## Project structure

```
yada/
├── yada-frontend/          # React + Vite
│   └── src/
│       ├── pages/          # Onboarding, Home, CheckIn, Journal, Crisis
│       ├── components/     # Reusable UI components
│       ├── services/       # Axios API calls
│       └── context/        # Auth context (JWT, user state)
│
└── yada-backend/           # Spring Boot
    └── src/main/java/com/yada/
        ├── entity/         # User, CheckIn, JournalEntry, RhemaPrompt
        ├── repository/     # JPA repositories
        ├── service/        # AuthService, ClaudeService
        ├── controller/     # AuthController, CheckInController, JournalController
        └── config/         # JwtUtil, JwtFilter, SecurityConfig
```

---

## Running locally

### Prerequisites

- Java 17
- Node.js 18+
- PostgreSQL (database name: `Yada`)
- A Claude API key from [console.anthropic.com](https://console.anthropic.com)

### Backend

```bash
cd yada-backend
```

Create `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/Yada
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8080
spring.application.name=yada-backend

app.jwt.secret=yadaSecretKey2026SuperLongStringForSecurityMustBeAtLeast32Chars
app.jwt.expiration=86400000

claude.api.key=your_claude_api_key
```

Then run:

```bash
./mvnw spring-boot:run
```

Backend starts on `http://localhost:8080`

### Frontend

```bash
cd yada-frontend
npm install
npm run dev
```

Frontend starts on `http://localhost:5173`

---

## API endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Check-in
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/checkin` | Submit answers, receive AI reflection |
| GET | `/api/checkin` | Get all check-ins for current user |

### Journal
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/journal` | Save a journal entry |
| GET | `/api/journal` | Get all journal entries for current user |

All endpoints except `/api/auth/**` require a valid JWT in the `Authorization: Bearer <token>` header.

---

## Key design decisions

**AI boundaries** — Claude API handles emotional reflection only. It speaks like a close friend, never a therapist. No clinical language, no generic responses. The prompt is tuned to empathise first, then gently apply CBT techniques like reframing where appropriate.

**CBT-informed check-in** — The three check-in questions are informed by validated mental health frameworks but delivered conversationally. The data is meaningful without the experience feeling clinical.

**Crisis mode** — Always one tap from the home screen. Grounding comes before anything else. No streaks broken, no data logged without consent, Samaritans number always visible.

**Not designed for engagement** — Yada is deliberately built to get users off their phones. The closing screen after every check-in says put the phone down. No streaks, no badges, no guilt mechanics.

---

## What's built

- [x] Full auth flow (register, login, JWT, protected routes)
- [x] Conversational onboarding (5 steps, faith tier selection)
- [x] Home screen with check-in CTA and crisis strip
- [x] Check-in flow with auto-advancing pill questions
- [x] Claude API integration generating personalised reflections
- [x] Journal entry after each check-in
- [ ] Crisis mode screen
- [ ] Journal history screen
- [ ] Pattern detection
- [ ] Deployment

---

## Disclaimer

Yada is a prototype exploring AI-supported emotional check-ins. It is not a therapy app, does not provide clinical assessment, and is not a replacement for professional mental health support. If you are in crisis, please contact Samaritans on **116 123** (free, 24/7).

