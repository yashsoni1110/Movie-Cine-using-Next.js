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
        : `Watch ${movie.title} on Cine-Stream.`,
      openGraph: {
        title: `${movie.title} | Cine-Stream`,
        description: movie.overview?.substring(0, 160),
        images: movie.poster_path
          ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`]
          : [],
      },
    };
  } catch {
    return { title: 'Movie | Cine-Stream' };
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
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-red-400 text-xl font-bold">Failed to load movie details.</p>
        <Link href="/" className="mt-4 inline-block text-gray-400 hover:text-white underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  const mainTrailer = movie.videos?.results?.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  ) || movie.videos?.results?.find((v) => v.site === 'YouTube');
  const cast = movie.credits?.cast?.slice(0, 8) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Backdrop */}
      <div className="relative w-full h-[55vh] bg-[#111] overflow-hidden">
        {(movie.backdrop_path || movie.poster_path) && (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
            alt={movie.title}
            fill
            className="object-cover opacity-40"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/30 to-transparent" />

        <div className="absolute bottom-8 left-0 w-full px-6 md:px-16">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors text-sm font-semibold">
            ← Back to Popular
          </Link>
          <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl uppercase tracking-tighter" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.9)' }}>
            {movie.title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="bg-[#E50914] text-white px-3 py-1 rounded text-sm font-bold">
              ★ {movie.vote_average?.toFixed(1)}
            </span>
            <span className="bg-[#404040] text-white px-3 py-1 rounded text-sm font-bold">
              {movie.release_date?.substring(0, 4)}
            </span>
            {movie.genres?.slice(0, 3).map((g) => (
              <span key={g.id} className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded text-sm font-bold border border-white/10">
                {g.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-16 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left: Poster */}
        <div className="md:col-span-1 flex justify-center md:justify-start">
          <div className="relative w-64 md:w-full max-w-xs rounded-xl overflow-hidden shadow-2xl border border-white/10">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={500}
                height={750}
                className="w-full"
              />
            ) : (
              <div className="aspect-[2/3] bg-gray-800 flex items-center justify-center">
                <span className="text-gray-500 text-sm">No Poster</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="md:col-span-2">
          <p className="text-[#e5e5e5] text-base md:text-lg leading-relaxed mb-8">
            {movie.overview || 'No overview available.'}
          </p>

          {/* Trailer */}
          {mainTrailer && (
            <div className="mb-8">
              <h2 className="text-white font-bold text-xl mb-4">Official Trailer</h2>
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-xl">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${mainTrailer.key}?controls=1&modestbranding=1&rel=0`}
                  title={mainTrailer.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Cast */}
          {cast.length > 0 && (
            <div>
              <h2 className="text-white font-bold text-xl mb-4">Cast</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {cast.map((person) => (
                  <div key={person.id} className="min-w-[90px] text-center">
                    <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-gray-800 mb-1 border border-white/10">
                      {person.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                          alt={person.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-2xl">
                          👤
                        </div>
                      )}
                    </div>
                    <p className="text-white text-xs font-bold leading-tight line-clamp-2">{person.name}</p>
                    <p className="text-gray-500 text-xs line-clamp-1">{person.character}</p>
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
