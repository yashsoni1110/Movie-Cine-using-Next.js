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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#0f1014] text-gray-100 selection:bg-red-500/30`}>
        <Navbar />
        <main className="max-w-[1920px] mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
