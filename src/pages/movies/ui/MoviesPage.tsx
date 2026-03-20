import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, Group, Spinner, Text } from '@vkontakte/vkui'
import { getMovies } from '@/api/movies'
import { useFavorites } from '@/app/providers/favorites-context'
import { MovieCard } from '@/components/movie-card/MovieCard'
import { InfoCard } from '@/components/info-card/InfoCard'
import {
  buildMoviesSearchParams,
  mapFiltersToMoviesQuery,
  parseMoviesFilters,
} from '@/pages/movies/model/filters'
import { MoviesFilters } from '@/pages/movies/ui/MoviesFilters'
import type { MovieListItem } from '@/types/movie'
import '@/pages/movies/ui/MoviesPage.css'

type MoviesRequestState =
  | {
      status: 'idle' | 'loading'
      items: MovieListItem[]
      total: number
      page: number
      pages: number
      error: null
      isFetchingMore: false
    }
  | {
      status: 'success'
      items: MovieListItem[]
      total: number
      page: number
      pages: number
      error: null
      isFetchingMore: boolean
    }
  | {
      status: 'error'
      items: MovieListItem[]
      total: number
      page: number
      pages: number
      error: string
      isFetchingMore: false
    }

const initialState: MoviesRequestState = {
  status: 'idle',
  items: [],
  total: 0,
  page: 0,
  pages: 0,
  error: null,
  isFetchingMore: false,
}

function mergeMovies(currentItems: MovieListItem[], nextItems: MovieListItem[]) {
  const seenIds = new Set(currentItems.map((movie) => movie.id))
  const uniqueNextItems = nextItems.filter((movie) => !seenIds.has(movie.id))

  return [...currentItems, ...uniqueNextItems]
}

export function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [moviesState, setMoviesState] = useState<MoviesRequestState>(initialState)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const canLoadMoreRef = useRef(true)
  const isFetchingMoreRef = useRef(false)
  const currentPageRef = useRef(0)
  const totalPagesRef = useRef(0)
  const { isFavorite, removeFromFavorites, requestAddToFavorites } = useFavorites()
  const filters = useMemo(() => parseMoviesFilters(searchParams), [searchParams])
  const moviesQuery = useMemo(() => mapFiltersToMoviesQuery(filters), [filters])

  function applyFilters(nextFilters: typeof filters) {
    setSearchParams(buildMoviesSearchParams(nextFilters), { replace: true })
  }

  useEffect(() => {
    currentPageRef.current = moviesState.page
    totalPagesRef.current = moviesState.pages
    isFetchingMoreRef.current = moviesState.isFetchingMore
  }, [moviesState.page, moviesState.pages, moviesState.isFetchingMore])

  useEffect(() => {
    let isMounted = true
    canLoadMoreRef.current = true
    isFetchingMoreRef.current = false
    currentPageRef.current = 0
    totalPagesRef.current = 0

    async function loadMovies() {
      setMoviesState({
        status: 'loading',
        items: [],
        total: 0,
        page: 0,
        pages: 0,
        error: null,
        isFetchingMore: false,
      })

      try {
        const response = await getMovies({
          ...moviesQuery,
          page: 1,
        })

        if (!isMounted) {
          return
        }

        setMoviesState({
          status: 'success',
          items: response.items,
          total: response.total,
          page: response.page,
          pages: response.pages,
          error: null,
          isFetchingMore: false,
        })
      } catch (error) {
        if (!isMounted) {
          return
        }

        const message = error instanceof Error ? error.message : 'Не удалось загрузить каталог.'

        setMoviesState({
          status: 'error',
          items: [],
          total: 0,
          page: 0,
          pages: 0,
          error: message,
          isFetchingMore: false,
        })
      }
    }

    void loadMovies()

    return () => {
      isMounted = false
    }
  }, [moviesQuery])

  useEffect(() => {
    if (moviesState.status !== 'success') {
      return
    }

    const node = loadMoreRef.current

    if (!node) {
      return
    }

    let isMounted = true

    async function loadNextPage() {
      if (
        !canLoadMoreRef.current ||
        isFetchingMoreRef.current ||
        currentPageRef.current >= totalPagesRef.current
      ) {
        return
      }

      canLoadMoreRef.current = false
      isFetchingMoreRef.current = true

      setMoviesState((currentState) => {
        if (currentState.status !== 'success') {
          return currentState
        }

        return {
          ...currentState,
          isFetchingMore: true,
        }
      })

      try {
        const response = await getMovies({
          ...moviesQuery,
          page: currentPageRef.current + 1,
        })

        if (!isMounted) {
          return
        }

        setMoviesState((currentState) => {
          if (currentState.status !== 'success') {
            return currentState
          }

          return {
            ...currentState,
            items: mergeMovies(currentState.items, response.items),
            total: response.total,
            page: response.page,
            pages: response.pages,
            isFetchingMore: false,
          }
        })
      } catch {
        if (!isMounted) {
          return
        }

        canLoadMoreRef.current = true

        setMoviesState((currentState) => {
          if (currentState.status !== 'success') {
            return currentState
          }

          return {
            ...currentState,
            isFetchingMore: false,
          }
        })
      } finally {
        isFetchingMoreRef.current = false
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return
        }

        if (!entry.isIntersecting) {
          canLoadMoreRef.current = true
          return
        }

        void loadNextPage()
      },
      {
        rootMargin: '120px 0px',
      },
    )

    observer.observe(node)

    return () => {
      isMounted = false
      observer.disconnect()
    }
  }, [moviesQuery, moviesState.status])

  if (moviesState.status === 'idle' || moviesState.status === 'loading') {
    return (
      <Group className="movies-page__state">
        <div className="movies-page__state-body">
          <Spinner size="xl" />
          <Text>Загружаем каталог фильмов...</Text>
        </div>
      </Group>
    )
  }

  if (moviesState.status === 'error') {
    return (
      <InfoCard
        title="Не удалось загрузить каталог"
        description={moviesState.error || 'Во время запроса к API произошла ошибка.'}
        footer={
          <Button mode="secondary" onClick={() => window.location.reload()}>
            Обновить страницу
          </Button>
        }
      />
    )
  }

  if (moviesState.items.length === 0) {
    return (
      <section className="movies-page">
        <header className="movies-page__header">
          <div className="movies-page__title-block">
            <h1 className="movies-page__title">Каталог</h1>
          </div>
        </header>

        <MoviesFilters
          filters={filters}
          onApply={applyFilters}
        />

        <InfoCard title="Ничего не найдено" description="Попробуйте ослабить фильтры или сбросить их." />
      </section>
    )
  }

  const hasMore = moviesState.page < moviesState.pages

  return (
    <section className="movies-page">
      <header className="movies-page__header">
        <div className="movies-page__title-block">
          <h1 className="movies-page__title">Каталог</h1>
        </div>

        <span className="movies-page__meta">Найдено: {moviesState.total}</span>
      </header>

      <MoviesFilters
        filters={filters}
        onApply={applyFilters}
      />

      <div className="movies-page__grid">
        {moviesState.items.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFavorite={isFavorite(movie.id)}
            onFavoriteToggle={() =>
              isFavorite(movie.id) ? removeFromFavorites(movie.id) : requestAddToFavorites(movie)
            }
          />
        ))}
      </div>

      {hasMore ? <div ref={loadMoreRef} className="movies-page__sentinel" aria-hidden="true" /> : null}

      {moviesState.isFetchingMore ? (
        <div className="movies-page__load-more">
          <Spinner size="m" />
        </div>
      ) : null}
    </section>
  )
}
