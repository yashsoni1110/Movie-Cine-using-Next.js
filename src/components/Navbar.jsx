'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaVideo, FaSearch, FaHeart } from 'react-icons/fa';

// "use client" — because we need useState for the search input
export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // Debounce the search: push to URL after 500ms of no typing
  useEffect(() => {
    // 🚩 FIX: Don't navigate if the searchQuery matches what's already in the URL
    // This prevents the "redirect to home on refresh" bug.
    const currentQ = searchParams.get('q') || '';
    if (searchQuery === currentQ) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery) {
        params.set('q', searchQuery);
        router.push(`/?${params.toString()}`);
      } else {
        // Only clear params if we are already on the home page
        // If we are on favorites/movie page, don't force-redirect to home on mount
        params.delete('q');
        router.push(`/?${params.toString()}`);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, router, searchParams]);

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10 p-4 w-full">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group select-none transition-transform hover:scale-105">
          <div className="bg-[#E50914] p-2 rounded-lg shadow-[0_0_15px_rgba(229,9,20,0.6)] group-hover:shadow-[0_0_25px_rgba(229,9,20,0.8)] transition-shadow">
            <FaVideo className="text-white text-xl" />
          </div>
          <div className="flex flex-col -gap-1">
            <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase leading-none">
              MOVIE<span className="text-[#E50914]">CINE</span>
            </span>
            <span className="text-[0.6rem] font-bold tracking-[0.3em] text-gray-500 uppercase ml-0.5 mt-0.5">
              Explore Movies
            </span>
          </div>
        </Link>

        {/* Search Bar — needs useState = Client Component */}
        <div className="relative w-full md:w-1/2 max-w-lg">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            id="movie-search"
            className="block w-full text-white bg-gray-900 border border-gray-700/50 rounded-full py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all shadow-inner"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Favorites Link */}
        <Link
          href="/favorites"
          className="flex items-center gap-2 text-white/80 hover:text-red-400 transition-colors font-semibold group bg-white/5 py-2 px-4 rounded-full border border-white/5 hover:border-red-500/30 hover:bg-red-500/10"
        >
          <FaHeart className="text-gray-400 group-hover:text-red-500 transition-colors" />
          My Favorites
        </Link>
      </div>
    </nav>
  );
}
