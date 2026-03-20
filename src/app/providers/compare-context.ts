import { createContext, useContext } from 'react'
import type { MovieListItem } from '@/types/movie'

export type CompareContextValue = {
  comparedMovies: MovieListItem[]
  isCompared: (movieId: number) => boolean
  toggleCompareMovie: (movie: MovieListItem) => void
  clearComparedMovies: () => void
}

export const CompareContext = createContext<CompareContextValue | null>(null)

export function useCompare() {
  const context = useContext(CompareContext)

  if (!context) {
    throw new Error('useCompare must be used within CompareProvider')
  }

  return context
}
