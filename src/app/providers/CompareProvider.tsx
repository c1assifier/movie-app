import { useEffect, useState, type PropsWithChildren } from 'react'
import { CompareContext } from '@/app/providers/compare-context'
import type { MovieListItem } from '@/types/movie'

const COMPARE_STORAGE_KEY = 'vk-test-app:compare'
const MAX_COMPARE_MOVIES = 2

function readComparedMovies() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedValue = window.localStorage.getItem(COMPARE_STORAGE_KEY)

    if (!storedValue) {
      return []
    }

    const parsedValue = JSON.parse(storedValue) as MovieListItem[]

    if (!Array.isArray(parsedValue)) {
      return []
    }

    return parsedValue
  } catch {
    return []
  }
}

export function CompareProvider({ children }: PropsWithChildren) {
  const [comparedMovies, setComparedMovies] = useState<MovieListItem[]>(() => readComparedMovies())

  useEffect(() => {
    window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(comparedMovies))
  }, [comparedMovies])

  function isCompared(movieId: number) {
    return comparedMovies.some((movie) => movie.id === movieId)
  }

  function toggleCompareMovie(movie: MovieListItem) {
    setComparedMovies((currentMovies) => {
      if (currentMovies.some((currentMovie) => currentMovie.id === movie.id)) {
        return currentMovies.filter((currentMovie) => currentMovie.id !== movie.id)
      }

      if (currentMovies.length < MAX_COMPARE_MOVIES) {
        return [...currentMovies, movie]
      }

      return [currentMovies[1], movie]
    })
  }

  function clearComparedMovies() {
    setComparedMovies([])
  }

  return (
    <CompareContext.Provider
      value={{
        comparedMovies,
        isCompared,
        toggleCompareMovie,
        clearComparedMovies,
      }}
    >
      {children}
    </CompareContext.Provider>
  )
}
