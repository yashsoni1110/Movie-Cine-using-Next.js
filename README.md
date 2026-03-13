# 🎬 Cine-Stream — The Ultimate Movie Discovery Experience

[![Deploy with Vercel](https://vercel.com/button)](https://movie-cine-using-next-js-b17d.vercel.app/) 

![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)

![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)

Cine-Stream is a premium, high-performance movie discovery application built with **Next.js 15**. It leverages **Server-Side Rendering (SSR)** for lightning-fast initial loads and **SEO optimization**, ensuring that movies and their details are easily discoverable by search engines.

---

## 📸 Screenshots

<img src="home.png" width="600" alt="Home Page Screenshot">
<p><i>Modern Glassmorphism UI with Ambient Background Lighting</i></p>

<img src="details.png" width="600" alt="Movie Details Screenshot">
<p><i>Cinematic Detail Pages with Integrated YouTube Trailers</i></p>

---

## ✨ Key Features

- **🚀 Server-Side Rendering (SSR)**: Popular movies are fetched directly on the server for instant page delivery and optimal SEO.
- **💎 Premium Design**: A modern, cinematic "Glassmorphism" aesthetic with custom animations and ambient background glow.
- **⚡ Performance Optimized**:
  - **Hover Prefetching**: Detailed movie data (trailers) starts loading the moment you hover over a card.
  - **Infinite Scroll**: Seamlessly browse thousands of movies with automatic pagination.
- **🔍 Advanced Search**: Real-time searching with **debouncing** to reduce API calls and improve performance.
- **❤️ Favorites System**: Save your favorite movies to a persistent list (stored in LocalStorage) that updates in real-time across the navbar.
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.
- **🔗 Persistent Modals**: URL-based modal state management ensures that movie trailers stay open even after a page refresh.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [React Icons (FontAwesome)](https://react-icons.github.io/react-icons/)
- **API**: [TMDB (The Movie Database)](https://www.themoviedb.org/)
- **State Management**: React Context (for Global Favorites)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yashsoni1110/Movie-Cine-using-Next.js.git
cd Movie-Cine
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory and add your TMDB API credentials:
```env
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
TMDB_BEARER_TOKEN=your_bearer_token_here
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## 📦 Deployment

This project is optimized for deployment on **Vercel**. 

1. Push your code to GitHub.
2. Import the project in Vercel.
3. Set your environment variables (`NEXT_PUBLIC_TMDB_API_KEY`, `TMDB_BEARER_TOKEN`) in the Vercel dashboard.
4. Deploy!

---

## 📄 License
This project is open-source and available under the MIT License.
