import { createContext, useContext } from 'react'
import type { MovieListItem } from '@/types/movie'

export type FavoritesContextValue = {
  favorites: MovieListItem[]
  isFavorite: (movieId: number) => boolean
  requestAddToFavorites: (movie: MovieListItem) => void
  removeFromFavorites: (movieId: number) => void
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function useFavorites() {
  const context = useContext(FavoritesContext)

  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }

  return context
}
