import { Suspense } from 'react';
import { fetchPopularMovies, fetchGenres } from '@/lib/api';
import HomeClient from '@/components/HomeClient';

// Loading fallback while HomeClient hydrates (useSearchParams needs Suspense)
function HomeLoading() {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-10 text-center md:text-left">
          <div className="h-10 w-64 bg-white/5 rounded-lg mb-2 animate-pulse" />
          <div className="h-3 w-40 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ✅ SERVER COMPONENT — fetches popular movies and genres on the server (Level 2 SSR)
export default async function HomePage() {
  // Fetch server-side — no useEffect, no useState!
  const [movieData, genres] = await Promise.all([
    fetchPopularMovies(1),
    fetchGenres()
  ]);
  
  const initialMovies = movieData.results || [];

  return (
    // Suspense is required when a Client Component inside uses useSearchParams()
    <Suspense fallback={<HomeLoading />}>
      <HomeClient initialMovies={initialMovies} genres={genres} />
    </Suspense>
  );
}
