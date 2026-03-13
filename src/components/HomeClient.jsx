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
    const queryChanged = urlQuery !== prevQueryRef.current;

    // Step 1: If query changed, reset list and page, then let activePage=1
    // trigger the effect again for the actual fetch
    if (queryChanged) {
      prevQueryRef.current = urlQuery;
      setMovies([]);
      setActivePage(1);
      setHasMore(true);
      setError(null);
      return; // Exit — setting activePage re-triggers this effect
    }

    // Step 2: No query on page 1 = show SSR popular movies, no fetch needed
    if (!urlQuery && activePage === 1) {
      setMovies(initialMovies);
      setHasMore(true);
      return;
    }

    // Step 3: Everything else = client-side fetch (search results, page > 1)
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

    fetchMovies();
    return () => { active = false; };
  }, [urlQuery, activePage]);

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
    <div className="container mx-auto px-4 py-8">
      {/* Page heading */}
      {!urlQuery ? (
        <h1 className="text-4xl font-black text-white mb-8 tracking-tight border-l-4 border-red-600 pl-4">
          Popular Movies
        </h1>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white text-center md:text-left">
            Search Results: <span className="text-red-500">"{urlQuery}"</span>
          </h1>
          <button
            onClick={() => {
              router.push('/');
            }}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white px-5 py-2 rounded-full font-bold transition-all shadow border border-gray-600"
          >
            ← Back to Popular
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
  );
}
