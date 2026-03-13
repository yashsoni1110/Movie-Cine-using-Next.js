import { Suspense } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'Cine-Stream — Discover Popular Movies',
    template: '%s | Cine-Stream',
  },
  description:
    'Cine-Stream is your ultimate movie discovery platform. Browse popular movies, watch trailers, and save your favorites — powered by TMDB.',
  keywords: ['movies', 'cinema', 'trailers', 'TMDB', 'popular movies', 'cine-stream'],
  openGraph: {
    title: 'Cine-Stream — Discover Popular Movies',
    description: 'Browse popular movies, watch trailers, and save your favorites.',
    type: 'website',
  },
};

import { FavoritesProvider } from '@/context/FavoritesContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#050505] text-gray-100 selection:bg-red-500/30`}>
        <FavoritesProvider>
          {/* Navbar Suspense */}
          <Suspense fallback={<div className="h-16 bg-black/80" />}>
            <Navbar />
          </Suspense>
          
          <main className="max-w-[1920px] mx-auto">
            {/* Global Page Suspense — required for useSearchParams() in Next.js 15 */}
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              {children}
            </Suspense>
          </main>
        </FavoritesProvider>
      </body>
    </html>
  );
}
