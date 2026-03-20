import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, Group, Spinner, Text } from '@vkontakte/vkui'
import { getMovies } from '@/api/movies'
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
      error: null
    }
  | {
      status: 'success'
      items: MovieListItem[]
      total: number
      error: null
    }
  | {
      status: 'error'
      items: MovieListItem[]
      total: number
      error: string
    }

const initialState: MoviesRequestState = {
  status: 'idle',
  items: [],
  total: 0,
  error: null,
}

export function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [moviesState, setMoviesState] = useState<MoviesRequestState>(initialState)
  const filters = useMemo(() => parseMoviesFilters(searchParams), [searchParams])

  useEffect(() => {
    let isMounted = true

    async function loadMovies() {
      setMoviesState((currentState) => ({
        ...currentState,
        status: 'loading',
        error: null,
      }))

      try {
        const response = await getMovies(mapFiltersToMoviesQuery(filters))

        if (!isMounted) {
          return
        }

        setMoviesState({
          status: 'success',
          items: response.items,
          total: response.total,
          error: null,
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
          error: message,
        })
      }
    }

    void loadMovies()

    return () => {
      isMounted = false
    }
  }, [filters])

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
          onApply={(nextFilters) =>
            setSearchParams(buildMoviesSearchParams(nextFilters), { replace: true })
          }
        />

        <InfoCard title="Ничего не найдено" description="Попробуйте ослабить фильтры или сбросить их." />
      </section>
    )
  }

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
        onApply={(nextFilters) => setSearchParams(buildMoviesSearchParams(nextFilters), { replace: true })}
      />

      <div className="movies-page__grid">
        {moviesState.items.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}
