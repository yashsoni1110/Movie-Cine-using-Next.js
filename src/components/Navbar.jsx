'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaVideo, FaSearch, FaHeart } from 'react-icons/fa';
import { useFavorites } from '@/hooks/useFavorites';

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { favorites } = useFavorites();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // 🔄 Sync local state with URL (fixes 'Back to Popular' loop)
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    if (searchQuery === currentQ) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery) {
        params.set('q', searchQuery);
        router.push(`/?${params.toString()}`);
      } else {
        params.delete('q');
        router.push(`/?${params.toString()}`);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, router, searchParams]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-4 py-3">
      <div className="max-w-[1400px] mx-auto glass-panel rounded-2xl flex items-center justify-between px-6 py-2.5 shadow-2xl gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group active:scale-95 transition-transform flex-shrink-0">
          <div className="bg-gradient-to-br from-red-500 to-red-700 p-2 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.3)] group-hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all">
            <FaVideo className="text-white text-lg" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-lg font-black tracking-tight text-white uppercase leading-none">
              MOVIE<span className="text-red-500">CINE</span>
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase leading-none mt-1">
              Cinema Stream
            </span>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md group">
          <div className="relative flex items-center">
            <FaSearch className="absolute left-4 text-gray-400 group-focus-within:text-red-500 transition-colors hidden xs:block" />
            <input
              type="text"
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-4 xs:pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:bg-white/10 transition-all placeholder:text-gray-500"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Favorites Link */}
        <Link
          href="/favorites"
          className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 group transition-all text-sm font-bold text-white border border-white/5 flex-shrink-0"
        >
          <FaHeart className="text-red-500 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline">Favorites</span>
          {favorites.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#050505] animate-in zoom-in duration-300">
              {favorites.length}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
