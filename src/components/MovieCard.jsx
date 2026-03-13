'use client';

import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';

export default function MovieCard({ movie, isFavorite, onToggleFavorite, onMovieClick }) {
  const rating = movie.vote_average?.toFixed(1) || '0.0';
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

  return (
    <div
      onClick={() => onMovieClick && onMovieClick(movie)}
      onMouseEnter={() => {
        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&append_to_response=videos`).catch(() => {});
      }}
      className="group relative aspect-[2/3] rounded-2xl overflow-hidden bg-white/5 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/5"
    >
      {/* Poster Image */}
      {movie.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-700 uppercase font-black text-xs tracking-widest text-center px-4">
          {movie.title}
        </div>
      )}

      {/* Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Dynamic Content */}
      <div className="absolute inset-x-0 bottom-0 p-4 transform transition-transform duration-500 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded leading-none">HD</span>
           <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{year}</span>
        </div>
        
        <h3 className="text-white font-bold leading-tight line-clamp-2 text-sm md:text-base group-hover:text-red-400 transition-colors">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-500 text-[10px]" />
            <span className="text-xs font-bold text-white">{rating}</span>
          </div>
        </div>
      </div>

      {/* Floating Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(movie);
        }}
        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full glass-panel flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 hover:bg-red-500 group/fav"
      >
        {isFavorite ? (
          <FaHeart className="text-red-500 group-hover/fav:text-white filter drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
        ) : (
          <FaRegHeart className="text-white text-sm" />
        )}
      </button>
      
      {/* Selection Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500/50 rounded-2xl transition-colors pointer-events-none" />
    </div>
  );
}
