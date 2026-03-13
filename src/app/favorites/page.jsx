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
    <div className="relative min-h-screen pt-32 pb-12 px-4 md:px-8">
      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/3 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link
              href="/"
              className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4 outline-none"
            >
              <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span> 
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
              MY <span className="text-red-500 text-glow">FAVORITES</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-widest text-[10px] mt-2 uppercase">
               Your personally curated collection — {favorites.length} {favorites.length === 1 ? 'Movie' : 'Movies'}
            </p>
          </div>

          <div className="flex items-center gap-3 glass-panel px-6 py-3 rounded-2xl shadow-xl">
             <FaHeart className="text-red-500 animate-pulse" />
             <span className="text-white font-bold text-lg">{favorites.length}</span>
             <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Saved</span>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 glass-panel rounded-3xl border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <FaFilm className="text-gray-800 text-8xl mb-6 transform group-hover:scale-110 transition-transform duration-500" />
            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Your list is empty</h2>
            <p className="text-gray-500 mb-10 text-center max-w-sm font-medium leading-relaxed">
              Every great journey starts with a single movie. Find your next favorite.
            </p>
            <button
              onClick={() => router.push('/')}
              className="relative z-10 bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(229,9,20,0.3)] hover:shadow-[0_15px_40px_rgba(229,9,20,0.5)] hover:-translate-y-1 active:translate-y-0 cursor-pointer"
            >
              Explore Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
            {favorites.map((movie, index) => (
              <div 
                key={movie.id} 
                className="animate-[fade-in-up_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
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
      </div>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}
