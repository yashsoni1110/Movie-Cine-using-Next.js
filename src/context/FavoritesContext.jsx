'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

const STORAGE_KEY = 'cine-favorites';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setFavorites(parsed);
      }
    } catch {
      // ignore errors
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when favorites change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // ignore
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

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
