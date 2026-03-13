import { Suspense } from 'react';
import { fetchPopularMovies } from '@/lib/api';
import HomeClient from '@/components/HomeClient';

// Loading fallback while HomeClient hydrates (useSearchParams needs Suspense)
function HomeLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-black text-white mb-8 tracking-tight border-l-4 border-red-600 pl-4">
        Popular Movies
      </h1>
      <div className="flex justify-center items-center py-20 gap-2">
        <div className="w-4 h-4 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-4 h-4 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

// ✅ SERVER COMPONENT — fetches popular movies on the server (Level 2 SSR)
export default async function HomePage() {
  // Fetch server-side — no useEffect, no useState!
  // Results are rendered in the HTML before it reaches the browser (SEO ✅)
  const data = await fetchPopularMovies(1);
  const initialMovies = data.results || [];

  return (
    // Suspense is required when a Client Component inside uses useSearchParams()
    <Suspense fallback={<HomeLoading />}>
      <HomeClient initialMovies={initialMovies} />
    </Suspense>
  );
}
