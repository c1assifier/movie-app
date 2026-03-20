import { useEffect, useState, type PropsWithChildren } from 'react'
import { FavoritesContext } from '@/app/providers/favorites-context'
import type { MovieListItem } from '@/types/movie'
import { ConfirmModal } from '@/components/confirm-modal/ConfirmModal'

const FAVORITES_STORAGE_KEY = 'vk-test-app:favorites'

function readFavorites() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedValue = window.localStorage.getItem(FAVORITES_STORAGE_KEY)

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

export function FavoritesProvider({ children }: PropsWithChildren) {
  const [favorites, setFavorites] = useState<MovieListItem[]>(() => readFavorites())
  const [pendingMovie, setPendingMovie] = useState<MovieListItem | null>(null)

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  function isFavorite(movieId: number) {
    return favorites.some((movie) => movie.id === movieId)
  }

  function requestAddToFavorites(movie: MovieListItem) {
    if (isFavorite(movie.id)) {
      return
    }

    setPendingMovie(movie)
  }

  function confirmAddToFavorites() {
    if (!pendingMovie) {
      return
    }

    setFavorites((currentFavorites) => {
      if (currentFavorites.some((movie) => movie.id === pendingMovie.id)) {
        return currentFavorites
      }

      return [pendingMovie, ...currentFavorites]
    })

    setPendingMovie(null)
  }

  function removeFromFavorites(movieId: number) {
    setFavorites((currentFavorites) => currentFavorites.filter((movie) => movie.id !== movieId))
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        requestAddToFavorites,
        removeFromFavorites,
      }}
    >
      {children}

      <ConfirmModal
        isOpen={pendingMovie !== null}
        title="Добавить в избранное?"
        description={pendingMovie ? `Фильм «${pendingMovie.title}» появится в отдельном списке.` : ''}
        confirmText="Добавить"
        cancelText="Отмена"
        onConfirm={confirmAddToFavorites}
        onCancel={() => setPendingMovie(null)}
      />
    </FavoritesContext.Provider>
  )
}
