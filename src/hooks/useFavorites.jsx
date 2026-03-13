'use client';

import { useFavorites as useFavoritesFromContext } from '@/context/FavoritesContext';

export function useFavorites() {
  return useFavoritesFromContext();
}
