'use client';

import { FaHeart, FaRegHeart, FaVideo } from 'react-icons/fa';

// "use client" because of the interactive favorite button (onClick + state)
export default function MovieCard({ movie, isFavorite, onToggleFavorite, onMovieClick }) {
  return (
    <div
      onClick={() => onMovieClick && onMovieClick(movie)}
      onMouseEnter={() => {
        // Prefetch movie details in background to speed up modal load
        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&append_to_response=videos`).catch(() => {});
      }}
      className="relative group rounded-xl overflow-hidden bg-gray-800 shadow-lg transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl flex flex-col h-full cursor-pointer"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#111]">
        {/* Fallback poster */}
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-800 p-4 text-center border-b border-gray-700/50">
          <FaVideo className="text-gray-600 text-4xl mb-3 drop-shadow-md" />
          <span className="text-gray-500 text-sm font-bold uppercase tracking-widest line-clamp-3">
            {movie.title || 'No Poster'}
          </span>
        </div>

        {/* Real poster image */}
        {movie.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 z-0"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90 z-10 pointer-events-none" />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1 z-20">
          <span className="text-yellow-400 font-bold text-sm">★</span>
          <span className="text-white text-sm font-medium">
            {movie.vote_average?.toFixed(1) || '0.0'}
          </span>
        </div>

        {/* Favorite Button — needs onClick = must be client component */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(movie);
          }}
          className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/80 transition-colors border border-white/10 group/btn z-20"
          aria-label="Toggle Favorite"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500 w-5 h-5 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          ) : (
            <FaRegHeart className="text-white w-5 h-5 group-hover/btn:scale-110 transition-transform" />
          )}
        </button>
      </div>

      <div className="p-4 flex-grow flex flex-col justify-end">
        <h3 className="text-lg font-bold text-white line-clamp-1 mb-1" title={movie.title}>
          {movie.title}
        </h3>
        <p className="text-sm text-gray-400">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown Year'}
        </p>
      </div>
    </div>
  );
}
