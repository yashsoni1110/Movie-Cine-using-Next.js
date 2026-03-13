'use client';

import Link from 'next/link';
import { FaHeart, FaFilm } from 'react-icons/fa';
import MovieCard from '@/components/MovieCard';
import MovieModal from '@/components/MovieModal';
import { useFavorites } from '@/hooks/useFavorites';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// "use client" — reads localStorage for favorites
export default function FavoritesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [selectedMovie, setSelectedMovie] = useState(null);

  // 🔄 Persistent Modal: Watch URL params for 'movie=ID'
  useEffect(() => {
    const movieId = searchParams.get('movie');
    if (movieId) {
      const existing = favorites.find(m => String(m.id) === String(movieId));
      setSelectedMovie(existing || { id: movieId });
    } else {
      setSelectedMovie(null);
    }
  }, [searchParams, favorites]);

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

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex items-center gap-3 mb-10 border-b border-gray-800 pb-4 flex-wrap">
        <Link
          href="/"
          className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white px-4 py-2 rounded-full text-sm font-bold transition-all border border-gray-600 mr-2"
        >
          ← Back
        </Link>
        <FaHeart className="text-red-500 text-3xl hidden sm:block" />
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wide">My Favorites</h1>
        <span className="ml-auto bg-red-600/20 text-red-400 py-1 px-3 rounded-full text-sm font-bold border border-red-500/30">
          {favorites.length} Saved
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800/50 backdrop-blur-sm">
          <FaFilm className="text-gray-700 text-6xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-300 mb-2">Your favorites list is empty</h2>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            Start adding movies to your favorites by clicking the heart icon on any movie card.
          </p>
          <Link
            href="/"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-red-500/25"
          >
            Discover Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {favorites.map((movie) => (
            <div key={movie.id} className="animate-[fade-in-up_0.6s_ease-out_forwards]">
                <MovieCard
                  movie={movie}
                  isFavorite={isFavorite(movie.id)}
                  onToggleFavorite={toggleFavorite}
                  onMovieClick={handleMovieClick}
                />
            </div>
          ))}
        </div>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
