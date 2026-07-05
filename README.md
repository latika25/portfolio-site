# Microservice Constellation — 3D Interactive Resume

A clean, single-page resume site: sticky nav, hero, and plain readable
sections for Experience, Projects, About/Skills, and Contact — every link
and label always visible, nothing hidden behind hover or click. The only
3D is a small glowing orb in the hero, purely decorative, so it can never
be confused for navigation.
Generate a random value,
# e.g. `openssl rand -hex 32`, and keep it secret. If unset, those two
# endpoints are disabled entirely rather than left open.
or use:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
## Stack

- **Frontend:** React (Vite) + Tailwind CSS + React Three Fiber / drei
- **Backend:** Go + Fiber, serving JSON over a minimal REST API
- **3D:** Programmatic primitives only (`InstancedMesh`, `QuadraticBezierLine`) — no `.gltf`/`.glb` assets, so there's nothing heavy to load

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
│   │   └── embed.go             # embeds the JSON into the compiled binary
│   ├── models/
│   │   └── types.go             # Node, Edge, ContactRequest, etc.
│   ├── handlers/
│   │   ├── resume.go            # GET /api/resume, GET /api/resume/:id
│   │   ├── contact.go           # POST /api/contact (+ GET for admin view)
│   │   └── analytics.go         # POST/GET /api/analytics/*
│   └── middleware/
│       └── cors.go              # CORS from ALLOWED_ORIGINS env var
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── App.jsx                        # assembles Navbar + sections + Footer
        ├── index.css
        ├── api/
        │   └── client.js                  # fetch wrapper for the Go API
        ├── hooks/
        │   └── useResumeData.js           # loads graph data, falls back locally on cold-start
        ├── data/
        │   ├── constants.js                # color tokens, API base URL
        │   └── fallbackResumeData.js       # local mirror shown while the API is waking up
        └── components/
            ├── layout/
            │   ├── Navbar.jsx              # sticky nav, anchor links to each section
            │   └── Footer.jsx              # social links
            ├── sections/
            │   ├── Hero.jsx                # headline + CTA + decorative orb
            │   ├── Experience.jsx          # plain readable work history list
            │   ├── Projects.jsx            # project cards grid
            │   ├── About.jsx               # bio + education + skills, grouped by category
            │   └── Contact.jsx             # contact info + form
            ├── Scene/
            │   ├── HeroCanvas.jsx          # small R3F canvas, hero-only
            │   └── HeroOrb.jsx             # simple glowing orb — decoration, not navigation
            └── UI/
                └── ContactForm.jsx         # posts to /api/contact
```

All sections read directly from `backend/data/resume_data.json` (via
`useResumeData`), so editing that one file updates the whole page — nothing
is hardcoded into the section components except headings/copy.

## Editing your content

You only need to touch **one file** to update everything the site shows:
`backend/data/resume_data.json`. Add/edit/remove entries in `nodes` and
`edges` and both the graph layout and detail panels update automatically —
no frontend code changes needed. Position values (`x, y, z`) are scene
units; nudge them to change how the constellation looks.

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
npm install
cp .env.example .env    # VITE_API_BASE_URL=http://localhost:8080
npm run dev              # -> http://localhost:5173
```

## Deployment (100% free tier)

### 1. Backend → Render (or Railway / Fly.io)

**Render (recommended — simplest for Docker + free tier):**

1. Push the `backend/` folder to a GitHub repo (or a `backend/` subfolder of one repo — Render supports monorepo "root directory").
2. On [render.com](https://render.com) → **New → Web Service** → connect your repo.
3. Set:
   - **Root Directory:** `backend`
   - **Runtime:** Docker (Render auto-detects the `Dockerfile`)
   - **Instance Type:** Free
4. Add environment variable:
   - `ALLOWED_ORIGINS` = `https://your-portfolio.vercel.app,http://localhost:5173`
5. Deploy. Render gives you a URL like `https://your-backend.onrender.com`.
6. **Note:** free Render services spin down after ~15 min idle and take
   20-50s to cold-start on the next request. That's exactly what
   `useResumeData.js`'s fallback data is for — visitors see the fallback
   graph immediately, then it swaps to live data once the backend wakes up.

**Railway alternative:** same steps — New Project → Deploy from GitHub →
set root directory to `backend` → add `ALLOWED_ORIGINS` env var. Railway's
free tier uses a small monthly credit rather than a sleep/wake cycle.

**Fly.io alternative:**
```bash
cd backend
fly launch     # detects the Dockerfile, asks a few questions
fly secrets set ALLOWED_ORIGINS="https://your-portfolio.vercel.app"
fly deploy
```

### 2. Frontend → Vercel (or Netlify)

**Vercel:**
1. Push `frontend/` to GitHub (same repo is fine).
2. [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Set **Root Directory** to `frontend`. Vercel auto-detects Vite.
4. Add environment variable:
   - `VITE_API_BASE_URL` = `https://your-backend.onrender.com`
5. Deploy.

**Netlify alternative:**
- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `frontend/dist`
- Same `VITE_API_BASE_URL` environment variable.

### 3. Close the loop

Go back to your Render/Railway/Fly dashboard and update `ALLOWED_ORIGINS`
to include your **actual** deployed frontend URL (not just `localhost`),
then redeploy the backend. Until you do this, the browser will block API
requests with a CORS error — this is the #1 thing people forget.

## Extending it

- **More nodes:** just add entries to `resume_data.json` — GitHub repos,
  certifications, talks, whatever. The `InstancedMesh` pattern in
  `NodesInstanced.jsx` scales to hundreds of nodes at near-flat frame cost.
- **Real email delivery:** `handlers/contact.go` currently logs submissions
  and stores them in memory. Swap in a provider like Resend or SendGrid
  (both have free tiers) where the comment in that file points you to.
- **Persistent analytics:** the view counters in `handlers/analytics.go`
  reset on redeploy. Fine for a personal site; if you want history, point
  them at a free-tier Redis (Upstash) or a DynamoDB table instead.
