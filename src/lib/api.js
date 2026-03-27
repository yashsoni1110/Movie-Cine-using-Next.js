const BASE_URL = 'https://api.themoviedb.org/3';

// Use Bearer token for server-side calls (more secure, modern approach)
const getHeaders = () => ({
  Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
  'Content-Type': 'application/json',
});

export const fetchPopularMovies = async (page = 1) => {
  const response = await fetch(
    `${BASE_URL}/movie/popular?language=en-US&page=${page}`,
    {
      headers: getHeaders(),
      next: { revalidate: 300 }, // Cache for 5 minutes (ISR)
    }
  );
  if (!response.ok) throw new Error('Failed to fetch popular movies');
  return response.json();
};

export const searchMovies = async (query, page = 1) => {
  if (!query) return { results: [], total_pages: 0 };
  const response = await fetch(
    `${BASE_URL}/search/movie?language=en-US&query=${encodeURIComponent(query)}&page=${page}`,
    { headers: getHeaders() }
  );
  if (!response.ok) throw new Error('Failed to search movies');
  return response.json();
};

export const fetchMovieDetails = async (id) => {
  const detailsRes = await fetch(
    `${BASE_URL}/movie/${id}?append_to_response=credits`,
    { headers: getHeaders(), next: { revalidate: 3600 } }
  );
  if (!detailsRes.ok) throw new Error('Failed to fetch movie details');
  const details = await detailsRes.json();

  try {
    const videoRes = await fetch(
      `${BASE_URL}/movie/${id}/videos?include_video_language=en,hi,ko,ja,zh,es,fr,de,it,pt,ru,null`,
      { headers: getHeaders() }
    );
    const videoData = videoRes.ok ? await videoRes.json() : { results: [] };
    details.videos = videoData;
  } catch {
    details.videos = { results: [] };
  }

  if (!details.videos?.results) details.videos = { results: [] };
  return details;
};

export const fetchGenres = async () => {
  const response = await fetch(`${BASE_URL}/genre/movie/list?language=en-US`, {
    headers: getHeaders(),
    next: { revalidate: 86400 }, // Cache genres for 24 hours
  });
  if (!response.ok) throw new Error('Failed to fetch genres');
  const data = await response.json();
  return data.genres || [];
};
