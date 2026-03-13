'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MovieCard from '@/components/MovieCard';
import MovieModal from '@/components/MovieModal';
import { useFavorites } from '@/hooks/useFavorites';

const BASE_URL = 'https://api.themoviedb.org/3';

export default function HomeClient({ initialMovies }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  // ✅ Initialize state correctly on first render:
  //    If no search query → use SSR data immediately (no flash of empty)
  //    If search query present → start empty and fetch
  const [movies, setMovies] = useState(() => (urlQuery ? [] : initialMovies));
  const [activePage, setActivePage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const observer = useRef();
  const prevQueryRef = useRef(urlQuery);

  // 🔄 Persistent Modal: Watch URL params for 'movie=ID'
  useEffect(() => {
    const movieId = searchParams.get('movie');
    if (movieId) {
      // Find in current list if possible, else use dummy with ID
      const existing = movies.find(m => String(m.id) === String(movieId));
      setSelectedMovie(existing || { id: movieId });
    } else {
      setSelectedMovie(null);
    }
  }, [searchParams, movies]);

  const handleMovieClick = (movie) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('movie', movie.id);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleCloseModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('movie');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    let active = true;
    
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const endpoint = urlQuery
          ? `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(urlQuery)}&page=${activePage}`
          : `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${activePage}`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('Failed to fetch movies');
        const data = await res.json();

        if (active) {
          setMovies((prev) => {
            // If it's a new search (activePage 1), replace previous list.
            // Otherwise, append for infinite scroll.
            const combined = activePage === 1 ? data.results : [...prev, ...data.results];
            const seen = new Set();
            return combined.filter((m) => (seen.has(m.id) ? false : seen.add(m.id)));
          });
          setHasMore(data.page < data.total_pages);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    // When query changes, reset everything and fetch from page 1
    if (urlQuery !== prevQueryRef.current) {
      prevQueryRef.current = urlQuery;
      setHasMore(true);
      setMovies([]); // Clear immediately
      setLoading(true); // Start loading immediately
      if (activePage === 1) {
        fetchMovies();
      } else {
        // This will trigger the effect again due to activePage change
        setActivePage(1);
      }
    } else {
      // Normal fetch for page changes or initial load
      if (!urlQuery && activePage === 1 && movies.length === 0) {
        setMovies(initialMovies);
        setLoading(false);
      } else {
        fetchMovies();
      }
    }

    return () => { active = false; };
  }, [urlQuery, activePage, initialMovies]);

  // Infinite scroll
  const lastMovieRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setActivePage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="relative min-h-screen pt-24 pb-12 px-4 md:px-8">
      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-[1400px] mx-auto">
      {/* Page heading */}
      {!urlQuery ? (
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
            TRENDING <span className="text-red-500 text-glow">NOW</span>
          </h1>
          <p className="text-gray-500 font-medium tracking-widest text-[10px] mt-2 uppercase">
             Top picks from Movie-Cine Global
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white text-center md:text-left">
            Search Results: <span className="text-red-500">"{urlQuery}"</span>
          </h1>
          <button
            onClick={() => {
              router.push('/');
            }}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] transition-all border border-white/10 hover:border-red-500/50 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-lg text-center max-w-2xl mx-auto">
          <p className="text-red-400 font-semibold text-lg">{error}</p>
        </div>
      )}

      {/* Grid */}
      {!error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie, index) => {
            const isLast = movies.length === index + 1;
            return (
              <div
                ref={isLast ? lastMovieRef : null}
                key={`${movie.id}-${index}`}
                className="animate-[fade-in-up_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${(index % 20) * 50}ms` }}
              >
                <MovieCard
                  movie={movie}
                  isFavorite={isFavorite(movie.id)}
                  onToggleFavorite={toggleFavorite}
                  onMovieClick={handleMovieClick}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-10 gap-2">
          <div className="w-4 h-4 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-4 h-4 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}

      {!loading && !hasMore && movies.length > 0 && (
        <div className="text-center py-10 text-gray-500 font-medium tracking-wide">
          You&apos;ve reached the end of the list.
        </div>
      )}

      {!loading && movies.length === 0 && !error && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl font-light">No movies found. Try another search!</p>
        </div>
      )}

      {/* Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
      </div>
    </div>
  );
}
