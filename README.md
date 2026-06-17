# Yada — Project Brief v2

**I'm building an app called Yada. Here is everything you need to know before we start.**

## What changed from v1

1. Crisis detection is now a defined flow: Claude returns structured JSON with a crisis flag, the backend sets `crisisMode`, the frontend responds differently. Previously the boolean existed but nothing set it.
2. The Claude system prompt was rewritten: mandated stock phrases removed, specificity required, crisis rule added, JSON output contract added.
3. Pattern detection logic changed from "14 consecutive low check-ins" to "majority low over a rolling 14-day window."
4. Rate limiting added: one check-in per user per 4 hours.
5. Privacy: delete-account endpoint specified, README privacy section required.
6. JWT secret moved to an environment variable (rotated, not written in this document).
7. Crisis.jsx is built (3 internal screens, zero logging) and needs testing.

## What Yada is

Yada is a mobile-first mental health and self-awareness app for young people aged 18-22. The name comes from the Hebrew word for intimate knowing. The app helps users understand what they are feeling through psychology-backed daily check-ins, AI-generated emotional reflections, and an optional progressive faith layer. It is a university portfolio project demonstrating full stack development, product thinking, and psychological depth.

The primary user is Ayo: 19, university student in London, no therapy access, friends who dismiss his feelings, social anxiety, emotional overwhelm. The app meets him where he is without preaching at him.

The app has a tiered faith model (surface/middle/deep) but the current prototype focuses on surface tier only: no religious language, CBT-backed reflections. Deeper tiers are deferred until the prototype is validated.

## Tech stack

- Frontend: React + Vite (localhost:5173)
- Backend: Spring Boot, Java 17 (localhost:8080)
- Database: PostgreSQL, local via pgAdmin, database name "Yada" (capital Y)
- AI: Claude API, model claude-sonnet-4-6
- Auth: JWT stored in localStorage
- Deployment targets: Vercel (frontend), Render (backend), Supabase (PostgreSQL)

## File locations

- Frontend: `C:\Users\jaydo\OneDrive\Documents\yada\yada-frontend\src`
- Backend: `C:\Users\jaydo\OneDrive\Documents\yada\yada-backend\src\main\java\com\yada\yada_backend`

## Backend structure

Entities (entity/):
- User.java — id, name, email, password (BCrypt), faithBackground, notificationTime, createdAt
- CheckIn.java — id, user (ManyToOne), answersJson (TEXT), moodLabel, reflection (TEXT), rhemaPrompt (TEXT), prayerPoint (TEXT), crisisMode (boolean, now actively set by ClaudeService), createdAt
- JournalEntry.java — id, user (ManyToOne), content (TEXT), promptUsed (TEXT), linkedCheckinId, createdAt
- RhemaPrompt.java — id, moodTag, faithTier, scripture, scriptureText (TEXT), reflectionPrompt (TEXT)

Repositories (repository/):
- UserRepository — findByEmail, existsByEmail
- CheckInRepository — findByUserIdOrderByCreatedAtDesc, findTop7ByUserIdOrderByCreatedAtDesc, deleteByUserId (to add)
- JournalEntryRepository — findByUserIdOrderByCreatedAtDesc, deleteByUserId (to add)
- RhemaPromptRepository — findByMoodTagAndFaithTier

Services (service/):
- AuthService — register, login, getCurrentUser, deleteAccount (to add)
- ClaudeService — generateReflection (now parses JSON, sets crisis flag), callClaude (private)

Controllers (controller/):
- AuthController — POST /api/auth/register, POST /api/auth/login, DELETE /api/auth/me (to add)
- CheckInController — POST /api/checkin (rate limited: rejects with 429 if user checked in within the last 4 hours; returns reflection + crisis flag + checkInId), GET /api/checkin
- JournalController — POST /api/journal (expects content + linkedCheckinId), GET /api/journal

Config (config/):
- JwtUtil — generateToken, extractEmail, validateToken
- JwtFilter — OncePerRequestFilter, reads Authorization header
- SecurityConfig — /api/auth/register and /api/auth/login are public, everything else requires JWT (note: DELETE /api/auth/me must require JWT), CORS allows localhost:5173

application.properties key values:
- spring.datasource.url=jdbc:postgresql://localhost:5432/Yada
- spring.datasource.username=postgres
- app.jwt.secret=[environment variable, rotated, not committed]
- claude.api.key=[environment variable, not committed]
- application.properties must be gitignored; verify it is not in git history

## Claude API contract (ClaudeService.java)

Claude must respond with ONLY a raw JSON object, no markdown fences, no surrounding text:

```json
{"crisis": false, "reflection": "..."}
```

The backend parses this, sets `crisisMode` on the CheckIn, stores the reflection, and returns `{ reflection, crisis, checkInId }` to the frontend. If parsing fails, fall back to crisis=false with the raw text as the reflection so the user never sees an error.

## Claude system prompt (current version)

> You are the reflection voice inside Yada, a mental health check-in app for young adults. You will receive a user's check-in answers.
>
> Respond with ONLY a raw JSON object, no markdown fences, no text before or after, in exactly this shape: {"crisis": false, "reflection": "your reflection here"}
>
> CRISIS RULE. This overrides everything else. If the user's words suggest self-harm, suicidal thoughts, wanting to disappear or stop existing, abuse, or being in danger, set crisis to true. In that case the reflection must stay calm and warm, take their words seriously without panic, gently encourage them to talk to a real person soon, and mention that Samaritans are free to call any time on 116 123, and 999 if they are in immediate danger. Do not use CBT techniques. Do not try to fix anything. Do not minimise. 4 to 6 sentences.
>
> When crisis is false, write the reflection like a close friend who genuinely listened. Refer to something specific the person actually said; specificity is how people feel heard. Acknowledge what is hard before anything else. Then, only if it fits naturally, offer one simple idea such as reframing a thought or noticing a pattern. If it does not fit, just be present with them. 5 to 7 sentences, short and real, plain words. Never use clinical language like validate, process, coping mechanisms, or self-care. Never use stock phrases like "It sounds like", "I hear that", "I hear you", or "you are not alone". Say something only this person's check-in could have produced. No dashes. No religious or biblical language. No lists. No questions back at them unless one genuinely helps.

## Frontend structure

pages/:
- Onboarding.jsx — 5 step conversational flow, collects name, faith background, email/password, notification time, calls POST /api/auth/register, stores token in localStorage. (Note: notificationTime is collected but unused; either build notifications later or note it as deferred in the README.)
- Home.jsx — warm greeting with user name and date, check-in card with Begin check-in button, crisis strip at bottom navigating to /crisis
- CheckIn.jsx — 3 questions (sleep/mind/calm), pill buttons auto-advance, calls POST /api/checkin. If response crisis is false: show reflection, journal textarea, Save to journal (POST /api/journal). If crisis is true: show the reflection in a warmer card with a tel:116123 button and a button to /crisis, and hide the journal textarea. Also handle 429 from rate limiting with a kind message.
- Crisis.jsx — BUILT, needs testing. Three internal screens via state (no routing): landing (I'm not okay + options), grounding (breathing circle, 3 cycles of 4s in / 4s hold / 6s out, then "five things you can see"), presence (held moment). Samaritans strip with tel:116123 and 999 note visible on all three. Logs nothing: no API calls, no analytics, by design.
- Journal.jsx — placeholder, needs building

services/api.js — Axios instance with JWT interceptor, exports authAPI, checkInAPI, journalAPI

context/AuthContext.jsx — provides user, token, login, logout across the app

App.jsx — React Router with PrivateRoute protecting /, /checkin, /journal, /crisis

## Design system (all inline styles, styles object outside component)

- Page background: #FDF8F4
- Warm header areas: #F5EDE3
- Purple cards: #EEEDFE
- Primary purple (buttons): #534AB7
- Crisis coral: #FAECE7
- Dark text: #2C2C2A
- Muted text: #888780
- Amber labels: #854F0B
- Card radius: 16px, button radius: 10px
- Pill buttons use className="pill" with CSS hover in index.css

## What is fully working

- Full auth flow: register, login, JWT, localStorage, protected routes
- Onboarding: full 5 step flow end to end
- Home screen: styled, working, navigation to check-in and crisis


## Build priorities (revised)

1. **Crisis detection wiring.** Rewrite the ClaudeService system prompt to the version above, add JSON parsing with safe fallback, set crisisMode on the CheckIn, return the crisis flag in the response, and add the crisis-true UI path in CheckIn.jsx. Test by typing crisis-adjacent language into a check-in and confirming the flag, the database value, and the alternate UI.
2. **Test Crisis.jsx** on mobile: breathing timing, tel: link, all three screens.
3. **Verify the journal save**: check-in response returns checkInId, journal controller expects linkedCheckinId. Do a full flow and inspect the journal_entry table in pgAdmin.
4. **Journal screen**: free write textarea linked to today's check-in at top, list of past entries below showing date, mood label, reflection excerpt and any user written content.
5. **Rate limiting**: reject check-ins within 4 hours of the previous one with a 429 and a kind message; handle it in the frontend.
6. **Pattern detection**: over the most recent 14 days of check-ins, if the majority are low mood, surface a gentle plain-language message suggesting speaking to someone, with a Samaritans link. Rolling majority, NOT consecutive.
7. **Delete account**: DELETE /api/auth/me removes the user's check-ins, journal entries, then the user (transactional). Add a privacy section to the README: plaintext storage acknowledged as a prototype decision, crisis mode logs nothing, users can delete all their data.
8. **Deploy**: Vercel frontend, Render backend, Supabase database. Secrets via environment variables only. Add a "Yada is waking up" loading state for Render free-tier cold starts (30 to 50 seconds on first request).

## Known issues

- Journal save field names unverified (checkInId vs linkedCheckinId), see priority 3.
- notificationTime collected but unused.
- Render free tier cold starts, mitigated by the loading state, not solved.

## Working rules for Claude Code

Explain your plan before editing anything. Make small, scoped changes,
one file at a time. Show diffs and wait for my approval before moving on.
Never add features beyond what is asked. Keep the existing code patterns,
inline styles object convention, and design system colours.
