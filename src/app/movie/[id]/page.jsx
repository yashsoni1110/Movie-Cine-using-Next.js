import { fetchMovieDetails } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

// generateMetadata runs on the SERVER — gives each movie its own SEO title + description
export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const movie = await fetchMovieDetails(id);
    const year = movie.release_date?.substring(0, 4) || '';
    return {
      title: `${movie.title} (${year})`,
      description: movie.overview
        ? movie.overview.substring(0, 160)
        : `Watch ${movie.title} on Movie-Cine.`,
      openGraph: {
        title: `${movie.title} | Movie-Cine`,
        description: movie.overview?.substring(0, 160),
        images: movie.poster_path
          ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`]
          : [],
      },
    };
  } catch {
    return { title: 'Movie | Movie-Cine' };
  }
}

// Server Component — all data fetched here, no useEffect needed
export default async function MovieDetailPage({ params }) {
  const { id } = await params;
  let movie;

  try {
    movie = await fetchMovieDetails(id);
  } catch {
    return (
      <div className="container mx-auto px-4 py-32 text-center pt-40">
        <p className="text-red-400 text-xl font-bold">Failed to load movie details.</p>
        <Link href="/" className="mt-4 inline-block text-gray-400 hover:text-white underline font-bold uppercase tracking-widest text-xs">
          ← Back to home
        </Link>
      </div>
    );
  }

  const mainTrailer = 
    movie.videos?.results?.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ||
    movie.videos?.results?.find((v) => v.type === 'Teaser' && v.site === 'YouTube') ||
    movie.videos?.results?.find((v) => v.site === 'YouTube');
  const cast = movie.credits?.cast?.slice(0, 8) || [];

  return (
    <div className="min-h-screen pb-20">
      {/* Ambient glass glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-gradient-to-b from-red-600/10 via-transparent to-transparent pointer-events-none -z-10" />

      {/* Hero Backdrop */}
      <div className="relative w-full h-[65vh] bg-[#050505] overflow-hidden">
        {(movie.backdrop_path || movie.poster_path) && (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
            alt={movie.title}
            fill
            className="object-cover opacity-30 scale-105 blur-[2px]"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent" />

        <div className="absolute bottom-12 left-0 w-full px-6 md:px-16 z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors text-xs font-black uppercase tracking-widest group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Home
          </Link>
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-3">
                <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">Movie Cine Exclusive</span>
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">{movie.status}</span>
             </div>
             <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl uppercase tracking-tighter max-w-4xl leading-[0.9] text-glow">
                {movie.title}
             </h1>
             <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md shadow-xl">
                   <span className="text-yellow-500 font-black tracking-tighter">★</span>
                   <span className="text-white text-sm font-bold">{movie.vote_average?.toFixed(1)}</span>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md text-white text-sm font-bold uppercase tracking-widest shadow-xl">
                   {movie.release_date?.substring(0, 4)}
                </div>
                <div className="flex flex-wrap gap-2">
                   {movie.genres?.slice(0, 3).map((g) => (
                      <span key={g.id} className="text-[10px] font-black uppercase tracking-widest text-gray-400 border border-white/10 px-2 py-1 rounded-lg">
                         {g.name}
                      </span>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 -mt-10 relative z-20">
        {/* Left: Poster */}
        <div className="lg:col-span-4 self-start sticky top-32">
          <div className="relative aspect-[2/3] w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/5 group">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={500}
                height={750}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <span className="text-gray-500 text-xs font-black uppercase tracking-widest">No Poster Available</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl">
              <h2 className="text-xs font-black text-red-500 uppercase tracking-[0.3em] mb-4">Storyline</h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed font-medium">
                {movie.overview || 'The plot details for this cinema piece are currently being curated.'}
              </p>
          </div>

          {/* Trailer */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Cinematic Premiere</h2>
            <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-gray-900 relative group">
              {mainTrailer ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${mainTrailer.key}?controls=1&modestbranding=1&rel=0`}
                  title={mainTrailer.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full relative">
                  <Image
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-6">
                    <div className="w-20 h-20 bg-[#E50914] rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                       <svg className="w-10 h-10 text-white ml-2" fill="currentColor" viewBox="0 0 24 24">
                         <path d="M8 5v14l11-7z" />
                       </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-white text-2xl font-black uppercase tracking-tighter mb-2">Watch Official Trailer</p>
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                          movie.title + ' ' + (movie.release_date?.substring(0, 4) || '') + ' official trailer'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-white text-black px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-2xl"
                      >
                        Search on YouTube
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cast */}
          {cast.length > 0 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Featured Artists</h2>
              <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                {cast.map((person) => (
                  <div key={person.id} className="min-w-[120px] text-center group">
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-white/5 mb-3 border border-white/10 group-hover:border-red-500 group-hover:scale-110 transition-all duration-300 shadow-xl">
                      {person.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                          alt={person.name}
                          width={120}
                          height={120}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-3xl">
                          👤
                        </div>
                      )}
                    </div>
                    <p className="text-white text-xs font-black leading-tight line-clamp-2 uppercase tracking-tighter mb-1">{person.name}</p>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest line-clamp-1">{person.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
