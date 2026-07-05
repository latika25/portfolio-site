# Portfolio Website

A clean, single-page resume site: sticky nav, hero, and plain readable
sections for Experience, Projects, About/Skills, and Contact — every link
and label always visible, nothing hidden behind hover or click. The only
3D is a small glowing orb in the hero, purely decorative, so it can never
be confused for navigation.

## Stack

- **Frontend:** React (Vite) + Tailwind CSS + React Three Fiber / drei
- **Backend:** Go + Fiber, serving JSON over a minimal REST API

## File structure

```
portfolio/
├── backend/
│   ├── main.go                  # Fiber app, middleware, route table
│   ├── go.mod
│   ├── Dockerfile
│   ├── .env.example
│   ├── data/
│   │   ├── resume_data.json     # ← edit this to update your content
│   │   └── embed.go             # embedded fallback copy, used only if the disk file is unreadable
│   ├── models/
│   │   └── types.go             # Node, Edge, ContactRequest, etc.
│   ├── handlers/
│   │   ├── resume.go            # GET /api/resume, GET /api/resume/:id — reads resume_data.json fresh from disk every request
│   │   ├── contact.go           # POST /api/contact (+ admin-only GET)
│   │   └── analytics.go         # POST /api/analytics/view, admin-only GET /api/analytics/summary
│   └── middleware/
│       ├── cors.go              # CORS from ALLOWED_ORIGINS env var
│       ├── security.go          # security response headers (X-Frame-Options, etc.)
│       └── auth.go              # RequireAdminToken — gates the two data-exposing GET endpoints
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js            # HMR/watch config for Docker/WSL/remote-dev environments
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .prettierrc.json
    ├── .prettierignore
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── App.jsx                        # single fetch of resume data, passed down as props to every section
        ├── index.css
        ├── api/
        │   └── client.js                  # fetch wrapper for the Go API
        ├── hooks/
        │   └── useResumeData.js           # loads graph data, falls back locally on cold-start — call this ONCE, in App.jsx only
        ├── data/
        │   ├── constants.js                # color tokens, API base URL
        │   └── fallbackResumeData.js       # local mirror shown while the API is waking up
        └── components/
            ├── layout/
            │   ├── Navbar.jsx              # sticky nav, anchor links to each section
            │   └── Footer.jsx              # social links — reads links from the coreNode prop, not its own fetch
            ├── sections/
            │   ├── Hero.jsx                # headline + CTA + decorative orb
            │   ├── Experience.jsx          # plain readable work history list
            │   ├── Projects.jsx            # project cards grid
            │   ├── About.jsx               # bio + education + skills, grouped by category
            │   └── Contact.jsx             # contact info (email only) + form
            ├── Scene/
            │   ├── HeroCanvas.jsx          # small R3F canvas, hero-only
            │   └── HeroOrb.jsx             # simple glowing orb — decoration, not navigation
            └── UI/
                └── ContactForm.jsx         # posts to /api/contact
```

## Editing content

You only need to touch **one file** to update everything the site shows:
`backend/data/resume_data.json`. Add/edit/remove entries in `nodes` and
`edges` and every section (Experience, Projects, About, Skills) updates
automatically — no frontend code changes needed.

**This now updates live, with no backend restart or rebuild.** `resume.go`
re-reads and re-parses the JSON straight off disk on every request, rather
than baking it into the compiled binary. Save the file, refresh your
browser, done — locally and in production alike. The copy embedded via
`data/embed.go` only kicks in as a fallback if the disk file is ever
missing or unreadable.

**One rule when adding new components:** if a component needs resume data,
take it as a **prop** from `App.jsx` — don't call `useResumeData()` again
inside it. That hook fires its own `fetch` on every call, so multiple
components calling it independently means multiple duplicate network
requests. `App.jsx` fetches once and passes slices down (`coreNode`,
`experienceNodes`, `projectNodes`, `skillNodes`) — follow that pattern.

## Local development

**Backend:**
```bash
cd backend
go mod tidy        # resolves & downloads dependencies, writes go.sum
cp .env.example .env
go run main.go      # -> http://localhost:8080
```

**Frontend:**
```bash
cd frontend
npm install          # or: yarn install
cp .env.example .env    # VITE_API_BASE_URL=http://localhost:8080
npm run dev              # -> http://localhost:5173
```


## Formatting

The frontend uses Prettier (with `prettier-plugin-tailwindcss` to
auto-sort Tailwind classes):
```bash
cd frontend
npm run format        
npm run format:check  
```
Go has its own built-in formatter — for the backend, run `gofmt -w .` or
`go fmt ./...` from `backend/` instead.

## Security

- **CORS** is locked to the origins listed in `ALLOWED_ORIGINS` — no
  wildcard, defaults to `localhost:5173` only if unset.
- **`ADMIN_TOKEN`** gates `GET /api/contact` (reading submitted messages)
  and `GET /api/analytics/summary`. Without it set, both endpoints return
  `503` — they fail closed, not open. Generate one with:
  ```bash
  openssl rand -hex 32
  # or, if you don't have openssl:
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  Call protected endpoints with `-H "X-Admin-Token: <value>"`.
- **Rate limiting**: 5 req/min/IP on `POST /api/contact`, 120 req/min/IP
  globally, as a baseline abuse guard.
- **Honeypot field** on the contact form catches naive bots without a
  CAPTCHA.
- **Security headers** (`X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`) set on every response.
- **1MB body limit** rejects oversized payloads before they reach a
  handler.
- What the hosting platforms handle for you: automatic HTTPS/TLS and
  basic network-layer DDoS protection (Vercel + Render both include this
  free). What they don't handle: anything above — that's this app's code,
  not infrastructure.
- Still on you: actually set `ADMIN_TOKEN` in your host's dashboard (never
  commit it), replace the `REPLACE_ME` placeholder links in
  `resume_data.json`, and periodically check dependencies for known
  vulnerabilities (`govulncheck` for Go, `npm audit` / `yarn audit` for
  the frontend).

### Ongoing workflow

Every `git push` to `main` auto-redeploys both Render and Vercel.
Content-only edits to `resume_data.json` take effect immediately on the
next request — no rebuild needed.

## Extending it

- **More content:** just add entries to `resume_data.json` — GitHub repos,
  certifications, talks, whatever. Every section reads from it directly.
- **Applying for a different kind of role:** data-driven content (jobs,
  projects, skills, links) only needs `resume_data.json` edited. A few
  spots have profile-specific prose hardcoded in JSX rather than pulled
  from data, and need a manual edit if you want to reposition your
  framing: the tagline in `Hero.jsx`, the bio paragraph and heading in
  `About.jsx`, the "Open to ... roles" line in `Contact.jsx`, and the
  `<title>`/meta description in `index.html`.
- **Real email delivery:** `handlers/contact.go` currently logs
  submissions and stores them in memory. Swap in a provider like Resend
  or SendGrid (both have free tiers) where the comment in that file
  points you to.
- **Persistent analytics:** the view counters in `handlers/analytics.go`
  reset on redeploy. Fine for a personal site; if you want history, point
  them at a free-tier Redis (Upstash) or a DynamoDB table instead.
