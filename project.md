# 🎬 Cine-Stream — Next.js 15 Project

A **Server-Side Rendered (SSR)** movie discovery app built with **Next.js 15 App Router**, migrated from a Vite/React (CSR) application. Fetches live data from the **TMDB API**.

---

## 📌 Project Info

| Field | Value |
|-------|-------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| API | TMDB (The Movie Database) |
| Auth | TMDB Bearer Token (server-side) |
| Rendering | SSR + ISR + Client Components |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd cine-stream-next
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the project root:
```env
TMDB_BEARER_TOKEN=your_bearer_token_here
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
```
> Get your keys from [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

### 3. Run Development Server
```bash
npm run dev
```
Open **http://localhost:3000**

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
cine-stream-next/
├── src/
│   ├── app/                        # App Router (Next.js)
│   │   ├── layout.js               # Root layout + global SEO metadata
│   │   ├── page.js                 # / — Home (Server Component)
│   │   ├── globals.css             # Global styles + Tailwind v4
│   │   ├── favorites/
│   │   │   └── page.js            # /favorites (Client Component)
│   │   └── movie/[id]/
│   │       └── page.js            # /movie/:id (Server Component + SSR metadata)
│   ├── components/
│   │   ├── Navbar.jsx             # Sticky navbar with search (Client)
│   │   ├── HomeClient.jsx         # Interactive home grid (Client)
│   │   ├── MovieCard.jsx          # Movie poster card with favorite (Client)
│   │   └── MovieModal.jsx         # Movie detail modal + trailer (Client)
│   ├── hooks/
│   │   └── useFavorites.js        # localStorage favorites hook (Client)
│   └── lib/
│       └── api.js                 # TMDB API helpers (Server-side only)
├── .env.local                     # API keys (never commit this!)
├── next.config.mjs                # Next.js config (TMDB image domain)
└── project.md                     # This file
```

---

## 🌐 Routes

| Route | Type | Description |
|-------|------|-------------|
| `/` | Server Component | Home — popular movies (SSR) |
| `/favorites` | Client Component | Your saved favorite movies |
| `/movie/[id]` | Server Component | Full movie detail page (SSR + SEO) |

---

## ⚙️ Key Concepts

### ✅ Level 1 — Setup & Routing
- Initialized with **`npx create-next-app@latest`** using the **App Router**
- File-based routing: each `page.js` inside a folder becomes a route
- Full Cine-Stream UI ported from the Vite version

### ✅ Level 2 — Server Components & SSR

#### Server Components (no `useEffect`)
```js
// app/page.js — runs on the SERVER
export default async function HomePage() {
  const data = await fetchPopularMovies(1); // Server-side fetch, no useEffect!
  return <HomeClient initialMovies={data.results} />;
}
```
Movies are **in the raw HTML** when it reaches the browser → Google can read them → **SEO ✅**

#### `generateMetadata` — Per-Movie SEO
```js
// app/movie/[id]/page.js
export async function generateMetadata({ params }) {
  const movie = await fetchMovieDetails(params.id);
  return {
    title: `${movie.title} (${year})`,
    description: movie.overview,
  };
}
```
Each movie gets its own browser tab title and meta description.

#### Client Components (`"use client"`)
Only used where **browser APIs or interactivity** is needed:

| Component | Reason for `"use client"` |
|-----------|--------------------------|
| `Navbar.jsx` | `useState` for search input |
| `HomeClient.jsx` | Search, infinite scroll, modal state |
| `MovieCard.jsx` | Favorite heart button `onClick` |
| `MovieModal.jsx` | `useEffect` to fetch trailer client-side |
| `useFavorites.js` | `localStorage` (browser-only) |

---

## 🔑 API Layer (`src/lib/api.js`)

Server-side only. Uses **TMDB Bearer Token** (never exposed to the browser).

```js
// Secure — Bearer token only available on server
headers: { Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}` }
```

With **ISR caching** for performance:
```js
fetch(url, { next: { revalidate: 300 } }) // Cache for 5 minutes
```

### Functions
| Function | Description |
|----------|-------------|
| `fetchPopularMovies(page)` | Get trending movies |
| `searchMovies(query, page)` | Search by title |
| `fetchMovieDetails(id)` | Full movie info + trailer videos + credits |

---

## 💡 SSR vs CSR — Why Next.js?

| | Vite (Old) | Next.js (New) |
|--|-----------|--------------|
| Rendering | Client-Side (CSR) | Server-Side (SSR) |
| SEO | ❌ Empty HTML | ✅ Movie data in HTML |
| First Load | Blank → JS loads → content | Content visible immediately |
| Google indexing | Hard | Easy |
| API Keys | Exposed in browser | Hidden on server |

---

## 📦 Dependencies

```json
{
  "next": "15.x",
  "react": "19.x",
  "react-dom": "19.x",
  "react-icons": "^5.x",
  "tailwindcss": "^4.x"
}
```

---

## 🔐 Environment Variables

| Variable | Used In | Description |
|----------|---------|-------------|
| `TMDB_BEARER_TOKEN` | Server only (`lib/api.js`) | TMDB read access token |
| `NEXT_PUBLIC_TMDB_API_KEY` | Client + Server | TMDB API key for client-side modal fetch |

> **`NEXT_PUBLIC_`** prefix = accessible in the browser  
> Without prefix = server-only (hidden from users)

---

## ✨ Features

- 🎬 Browse **popular movies** (SSR — rendered on server)
- 🔍 **Search movies** in real-time (client-side, URL-based)
- 🎞️ **Movie modal** with auto-playing trailer
- ❤️ **Favorites** — save movies (persisted in `localStorage`)
- 📄 **Dedicated movie page** (`/movie/[id]`) with full details + cast
- 📱 **Fully responsive** — works on mobile, tablet, desktop
- 🔍 **SEO optimized** — metadata, Open Graph tags, semantic HTML
