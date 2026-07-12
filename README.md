# EventHive

A full-stack event discovery & booking platform. Built with Next.js (App Router),
TypeScript, Tailwind CSS, MongoDB (Mongoose), and JWT authentication.

## Progress

- [x] Step 1 — Project setup & authentication system
- [x] Step 2 — Landing page (hero + 7 sections) & Explore/listing page
- [x] Step 3 — Event details page
- [x] Step 4 — Protected "Add Event" & "Manage Events" pages
- [x] Step 5 — About / Contact / Help / Privacy / Terms pages, polish

**The full app is built.** See "What's built" below for a complete feature list.

## Tech stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, lucide-react
- **Backend**: Next.js Route Handlers (API routes), TypeScript
- **Database**: MongoDB via Mongoose
- **Auth**: JWT stored in an httpOnly cookie, bcrypt password hashing
- **Validation**: Zod (shared client/server schemas)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in MONGODB_URI and JWT_SECRET
npm run seed                 # creates demo accounts + ~28 sample events
npm run dev
```

Visit `http://localhost:3000`.

## Demo credentials

| Role | Email | Password |
|---|---|---|
| User | `demo.user@eventhive.app` | `DemoUser123` |
| Admin | `demo.admin@eventhive.app` | `DemoAdmin123` |

Both also work via the **Demo login** buttons on `/login`.

## What's built

**Authentication** — register/login/logout, bcrypt password hashing, JWT in an httpOnly
cookie, `src/middleware.ts` protecting `/items/add`, `/items/manage`, `/dashboard` at
the edge (redirects to `/login?redirect=...`). Demo login buttons for both roles.

**Landing page (`/`)** — hero (60–70vh, interactive search + quick category filters),
then 7 sections: Categories, Featured Events (live MongoDB data), How It Works, Stats,
Testimonials, FAQ (accordion), Newsletter/CTA. Navbar (3 routes logged out, 5 logged
in) and a full Footer with working links.

**Explore page (`/explore`)** — debounced search, 3 filters (category, city, max
price), 5 sort options, pagination, 4-column responsive grid, skeleton loaders, empty
state.

**Event details page (`/events/[id]`)** — public, image gallery with thumbnails,
overview, key info/specs, reviews with ratings, related events, and a working
"Book now" action (protected — redirects to login if needed, decrements seats live).

**Add Event (`/items/add`)** — protected form: title, short/full description,
category, date, time, venue, city, price, capacity, optional image URL. Full
client + server-side validation with field-level errors.

**Manage Events (`/items/manage`)** — protected. Table on desktop, cards on mobile.
View and Delete actions per event, with a confirmation dialog before deleting. Includes
a Recharts bar chart of booked vs. available seats across your listed events.

**Additional pages** — About, Contact (working form), Help & Support (FAQ), Privacy
Policy, Terms of Service. Plus a styled 404 page.

## Routes reference

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/explore` | Public | Browse/search/filter events |
| `/events/[id]` | Public | Event details + booking |
| `/login`, `/register` | Public | Auth |
| `/items/add` | Protected | Create an event |
| `/items/manage` | Protected | View/delete your events |
| `/about`, `/contact`, `/help`, `/privacy`, `/terms` | Public | Info pages |

## API reference

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/api/auth/register` | POST | Public | Create account |
| `/api/auth/login` | POST | Public | Log in |
| `/api/auth/logout` | POST | Public | Log out |
| `/api/auth/me` | GET | Public | Current session |
| `/api/events` | GET | Public | List with search/filter/sort/pagination |
| `/api/events` | POST | Protected | Create an event |
| `/api/events/[id]` | GET | Public | Single event |
| `/api/events/[id]` | DELETE | Owner/Admin | Delete an event |
| `/api/events/[id]/book` | POST | Protected | Reserve a seat |
| `/api/events/mine` | GET | Protected | Events you created |

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import it in Vercel — it auto-detects Next.js, no config needed.
3. Add `MONGODB_URI`, `JWT_SECRET`, `AUTH_COOKIE_NAME` as environment variables in
   Vercel's project settings.
4. In MongoDB Atlas, allow access from anywhere (`0.0.0.0/0`) under Network Access,
   since serverless functions don't have a fixed IP.
5. Deploy. Run `npm run seed` locally (pointed at the same Atlas cluster) once to
   populate demo accounts and sample events.

## Project structure

```
src/
  app/
    api/auth/{register,login,logout,me}/route.ts
    api/events/route.ts             GET (list) + POST (create)
    api/events/[id]/route.ts        GET (detail) + DELETE
    api/events/[id]/book/route.ts   POST (reserve a seat)
    api/events/mine/route.ts        GET (your events)
    events/[id]/page.tsx            Event details
    explore/page.tsx                Listing page
    items/add/page.tsx              Protected — create event
    items/manage/page.tsx           Protected — manage events
    about/, contact/, help/, privacy/, terms/
    login/, register/
    layout.tsx, page.tsx, globals.css, not-found.tsx
  components/       Navbar, Footer, EventCard, EventCardSkeleton, EventGallery,
                     BookButton, HeroSearch, FAQAccordion, NewsletterForm, ManageEventsChart
  context/          AuthContext
  lib/              db.ts, auth.ts, validators.ts, serializeEvent.ts
  models/           User.ts, Event.ts
  scripts/          seed.ts
  middleware.ts
```
