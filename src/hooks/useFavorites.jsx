'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cine-favorites';

export function useFavorites() {
  // ✅ Tracks whether we've finished loading from localStorage
  const [isHydrated, setIsHydrated] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Step 1: Load from localStorage once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setFavorites(parsed);
      }
    } catch {
      // ignore parse errors
    }
    // Mark hydration complete — triggers re-render with isHydrated=true
    setIsHydrated(true);
  }, []);

  // Step 2: Save to localStorage — ONLY after hydration is complete.
  // isHydrated in the deps array means this only runs after it flips to true.
  // The initial render has isHydrated=false so the guard prevents the wipe.
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // ignore storage errors
    }
  }, [favorites, isHydrated]);

  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      return exists
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie];
    });
  };

  const isFavorite = (movieId) => favorites.some((m) => m.id === movieId);

  return { favorites, toggleFavorite, isFavorite };
}
