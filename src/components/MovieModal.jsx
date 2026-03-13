'use client';

import { useEffect, useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';

// "use client" — uses useEffect (browser-only), document.body manipulation
export default function MovieModal({ movie, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const getDetails = async () => {
      try {
        // Client-side fetch using the public API key
        const BASE_URL = 'https://api.themoviedb.org/3';
        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

        const detailsRes = await fetch(
          `${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&append_to_response=credits`
        );
        if (!detailsRes.ok) throw new Error('Failed to load movie details');
        const data = await detailsRes.json();

        const [usVidRes, mVidRes] = await Promise.all([
          fetch(`${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`),
          fetch(`${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}&include_video_language=en,hi,ko,ja`),
        ]);
        const usData = usVidRes.ok ? await usVidRes.json() : { results: [] };
        const mData = mVidRes.ok ? await mVidRes.json() : { results: [] };
        const unique = [...usData.results, ...mData.results].filter(
          (v, i, a) => a.findIndex((t) => t.key === v.key) === i
        );
        data.videos = { results: unique };
        setDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getDetails();
    return () => { document.body.style.overflow = 'auto'; };
  }, [movie.id]);

  const videos = details?.videos?.results || [];
  const mainTrailer =
    videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
    videos.find((v) => v.site === 'YouTube' && v.type === 'Teaser') ||
    videos.find((v) => v.site === 'YouTube');
  const allTrailers = videos.filter((v) => v.site === 'YouTube');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#141414] rounded-xl overflow-hidden shadow-2xl z-10 animate-[fade-in-up_0.4s_ease-out] flex flex-col">
        {loading ? (
          <div className="p-20 flex justify-center items-center h-96">
            <div className="w-8 h-8 rounded-full bg-[#E50914] animate-bounce" />
          </div>
        ) : error ? (
          <div className="p-20 text-center text-red-500 h-96 flex justify-center items-center">
            <p className="text-xl font-bold">Failed to load: {error}</p>
          </div>
        ) : (
          <div className="flex flex-col w-full h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Hero / Trailer */}
            <div className="relative w-full flex-shrink-0 aspect-video md:max-h-[60vh] bg-black rounded-t-xl overflow-hidden">
              {mainTrailer ? (
                <iframe
                  className="w-full h-full pointer-events-auto rounded-t-xl"
                  src={`https://www.youtube-nocookie.com/embed/${mainTrailer.key}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div
                  className="w-full h-full bg-[#111] flex flex-col justify-center items-center rounded-t-xl"
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path || details.poster_path})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <span className="text-gray-300 font-bold tracking-widest uppercase">
                      No Official Trailer Found
                    </span>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                        details.title + ' ' + (details.release_date?.substring(0, 4) || '') + ' official trailer'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#E50914] hover:bg-[#b80710] text-white px-5 py-2 rounded-full font-bold transition-transform hover:scale-105 shadow-xl flex items-center gap-2"
                    >
                      Search on YouTube
                    </a>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 md:bottom-6 left-0 w-full px-6 md:px-10 pointer-events-none">
                <h2
                  className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl uppercase tracking-tighter"
                  style={{ textShadow: '0px 2px 10px rgba(0,0,0,0.9)' }}
                >
                  {details.title}
                </h2>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold z-20 border border-white/10 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Details */}
            <div className="px-6 md:px-10 pb-6 pt-5 relative z-20 flex-grow flex flex-col">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-200 font-medium mb-3">
                <span className="bg-[#404040] px-2 py-1 rounded text-white font-bold">
                  {details.release_date?.substring(0, 4) || 'N/A'}
                </span>
                <span className="bg-[#404040] px-2 py-1 rounded text-white font-bold">
                  {details.adult ? 'A 18+' : 'U/A 16+'}
                </span>
                {details.genres?.slice(0, 3).map((g) => (
                  <span key={g.id} className="bg-[#404040] px-2 py-1 rounded text-white font-bold">
                    {g.name}
                  </span>
                ))}
                <span className="ml-auto text-yellow-400 font-bold">
                  ★ {details.vote_average?.toFixed(1)}
                </span>
              </div>

              {/* Overview */}
              <p className="text-[#e5e5e5] text-sm md:text-base leading-relaxed mb-6 font-normal">
                {details.overview || 'No overview available.'}
              </p>

              {/* Trailers List */}
              {allTrailers.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-bold text-lg mb-3">Clips & Trailers</h3>
                  <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {allTrailers.map((vid) => (
                      <div
                        key={vid.id}
                        className="min-w-[260px] md:min-w-[320px] aspect-video flex-shrink-0 relative rounded-xl overflow-hidden shadow-lg bg-[#222]"
                      >
                        <iframe
                          className="w-full h-full absolute inset-0"
                          src={`https://www.youtube-nocookie.com/embed/${vid.key}?controls=1&modestbranding=1&rel=0`}
                          title={vid.name}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button className="flex items-center justify-center gap-2 bg-[#E50914] hover:bg-[#b80710] text-white px-6 md:px-8 py-2 md:py-3 rounded text-base md:text-lg font-bold transition-colors w-max shadow-lg mt-auto">
                Get Started
                <FaChevronRight className="w-4 h-4 mt-0.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
