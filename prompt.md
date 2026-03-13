# 🚀 Next.js 15 Migration Journey: The Prompts

### **Step 1: Project Initialization & Routing**
> *"I want to migrate my React (Vite) movie app to Next.js 15. Please initialize a new project using the **App Router**. Help me recreate my folder structure so that `/` is the home page, `/movie/[id]` is the detail page, and `/favorites` is the favorite movies page. I want to use file-based routing."*

---

### **Step 2: Understanding Server Components (SSR)**
> *"I'm getting an error when I use `useState` or `useEffect` in my `page.js`. Can you explain why this happens in the Next.js App Router? Also, show me how to fetch 'Popular Movies' from TMDB directly on the server without using `useEffect`, so that my page is SEO-friendly."*

---

### **Step 3: Handling Client Interactivity**
> *"I have a Search Bar and a 'Add to Favorites' heart button. These need `useState`. How should I structure my project so that I can keep most of the page as a Server Component, but only make these specific interactive parts Client Components using the `'use client'` directive?"*

---

### **Step 4: Fixing Image Security**
> *"I'm using the Next.js `<Image />` component to show movie posters from TMDB, but the images are not loading. How do I configure my `next.config.js` to allow images from `image.tmdb.org`?"*

---

### **Step 5: Advanced UI (Glassmorphism & Branding)**
> *"I want my Movie App to look premium and cinematic. Can you update my `globals.css` and components to use a **Glassmorphism** theme? I want a deep black background (`#050505`), red accents (`#E50914`), blurred navbar with glass effects, and ambient background glow."*

---

### **Step 6: Performance Optimization (Pre-fetching & Fast Loading)**
> *"When a user hovers over a movie card, I want to start fetching the movie trailer data in the background. This way, when they click the movie, the trailer modal opens instantly. How can I implement this **Hover Prefetching** logic in my `MovieCard` component?"*

---

### **Step 7: Solving Persistent Modal on Refresh**
> *"If a user opens a movie modal and refreshes the page, the modal closes. How can I sync the `selectedMovie` state with a URL query parameter (like `?movie=123`) so that the modal stays open on refresh?"*

---

### **Step 8: Fixing Hydration Errors**
> *"I'm getting a 'Hydration failed' error in my Navbar because it shows a favorite count badge from `localStorage`. How can I use a `mounted` state or an `useEffect` to ensure the server and client HTML match perfectly during the initial render?"*

---

### **Step 9: Global State for Favorites**
> *"I want my favorite movies count in the Navbar to update instantly when I click the heart button on a movie card, without refreshing. Please set up a `FavoritesContext` and wrap the app in a `FavoritesProvider` in the root layout."*

---

### **Step 10: Vercel Deployment**
> *"My Next.js project is ready. How do I deploy it to Vercel? Please guide me on how to set up GitHub integration and where to add my `NEXT_PUBLIC_TMDB_API_KEY` environment variables."*
