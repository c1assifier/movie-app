import { useEffect, useState } from 'react'
import { LuChevronDown } from 'react-icons/lu'
import { Button, FormItem, Input } from '@vkontakte/vkui'
import type { MovieGenre, MoviesFilters as MoviesFiltersValue } from '@/pages/movies/model/filters'
import {
  defaultMoviesFilters,
  MAX_RATING,
  MAX_YEAR,
  MIN_RATING,
  MIN_YEAR,
  MOVIE_GENRES,
} from '@/pages/movies/model/filters'

type MoviesFiltersProps = {
  filters: MoviesFiltersValue
  onApply: (filters: MoviesFiltersValue) => void
}

type MoviesFiltersDraft = {
  genres: MovieGenre[]
  ratingFrom: string
  ratingTo: string
  yearFrom: string
  yearTo: string
}

function createDraft(filters: MoviesFiltersValue): MoviesFiltersDraft {
  return {
    genres: filters.genres,
    ratingFrom: String(filters.ratingFrom),
    ratingTo: String(filters.ratingTo),
    yearFrom: String(filters.yearFrom),
    yearTo: String(filters.yearTo),
  }
}

function parseInputValue(value: string, fallback: number, min: number, max: number) {
  if (!value.trim()) {
    return fallback
  }

  const parsedValue = Number(value)

  if (!Number.isFinite(parsedValue)) {
    return fallback
  }

  return Math.min(Math.max(parsedValue, min), max)
}

export function MoviesFilters({ filters, onApply }: MoviesFiltersProps) {
  const [draftFilters, setDraftFilters] = useState<MoviesFiltersDraft>(createDraft(filters))

  useEffect(() => {
    setDraftFilters(createDraft(filters))
  }, [filters])

  function toggleGenre(genre: MovieGenre) {
    if (draftFilters.genres.includes(genre)) {
      setDraftFilters((currentFilters) => ({
        ...currentFilters,
        genres: currentFilters.genres.filter((currentGenre) => currentGenre !== genre),
      }))

      return
    }

    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      genres: [...currentFilters.genres, genre],
    }))
  }

  function hasChanges() {
    return JSON.stringify(draftFilters) !== JSON.stringify(createDraft(filters))
  }

  function applyFilters() {
    onApply({
      genres: draftFilters.genres,
      ratingFrom: parseInputValue(draftFilters.ratingFrom, MIN_RATING, MIN_RATING, MAX_RATING),
      ratingTo: parseInputValue(draftFilters.ratingTo, MAX_RATING, MIN_RATING, MAX_RATING),
      yearFrom: parseInputValue(draftFilters.yearFrom, MIN_YEAR, MIN_YEAR, MAX_YEAR),
      yearTo: parseInputValue(draftFilters.yearTo, MAX_YEAR, MIN_YEAR, MAX_YEAR),
    })
  }

  function resetDraft() {
    setDraftFilters(createDraft(defaultMoviesFilters))
  }

  return (
    <section className="movies-filters">
      <details className="movies-filters__panel" open>
        <summary className="movies-filters__panel-summary">
          <div className="movies-filters__panel-heading">
            <span className="movies-filters__title">Фильтры</span>
            <span className="movies-filters__panel-meta">
              {filters.genres.length > 0 ? `Жанров: ${filters.genres.length}` : 'Без ограничений по жанру'}
            </span>
          </div>

          <span className="movies-filters__summary-icon" aria-hidden="true">
            <LuChevronDown />
          </span>
        </summary>

        <div className="movies-filters__content">
          <details className="movies-filters__dropdown" open>
            <summary className="movies-filters__summary">
              <div className="movies-filters__summary-text">
                <span className="movies-filters__summary-label">Жанры</span>
                <span className="movies-filters__summary-value">
                  {draftFilters.genres.length > 0 ? `Выбрано: ${draftFilters.genres.length}` : 'Все жанры'}
                </span>
              </div>

              <span className="movies-filters__summary-icon" aria-hidden="true">
                <LuChevronDown />
              </span>
            </summary>

            <div className="movies-filters__dropdown-body movies-filters__dropdown-body--genres">
              {MOVIE_GENRES.map((genre) => {
                const isActive = draftFilters.genres.includes(genre)

                return (
                  <label key={genre} className="movies-filters__option">
                    <input
                      className="movies-filters__checkbox"
                      type="checkbox"
                      checked={isActive}
                      onChange={() => toggleGenre(genre)}
                    />
                    <span className="movies-filters__option-text">{genre}</span>
                  </label>
                )
              })}
            </div>
          </details>

          <div className="movies-filters__ranges">
            <details className="movies-filters__dropdown" open>
              <summary className="movies-filters__summary">
                <div className="movies-filters__summary-text">
                  <span className="movies-filters__summary-label">Рейтинг</span>
                  <span className="movies-filters__summary-value">
                    От {draftFilters.ratingFrom || '...'} до {draftFilters.ratingTo || '...'}
                  </span>
                </div>

                <span className="movies-filters__summary-icon" aria-hidden="true">
                  <LuChevronDown />
                </span>
              </summary>

              <div className="movies-filters__dropdown-body">
                <div className="movies-filters__range-grid">
                  <FormItem top="От">
                    <Input
                      type="number"
                      min={MIN_RATING}
                      max={MAX_RATING}
                      step={0.1}
                      value={draftFilters.ratingFrom}
                      onChange={(event) =>
                        setDraftFilters((currentFilters) => ({
                          ...currentFilters,
                          ratingFrom: event.target.value,
                        }))
                      }
                    />
                  </FormItem>

                  <FormItem top="До">
                    <Input
                      type="number"
                      min={MIN_RATING}
                      max={MAX_RATING}
                      step={0.1}
                      value={draftFilters.ratingTo}
                      onChange={(event) =>
                        setDraftFilters((currentFilters) => ({
                          ...currentFilters,
                          ratingTo: event.target.value,
                        }))
                      }
                    />
                  </FormItem>
                </div>
              </div>
            </details>

            <details className="movies-filters__dropdown" open>
              <summary className="movies-filters__summary">
                <div className="movies-filters__summary-text">
                  <span className="movies-filters__summary-label">Год выпуска</span>
                  <span className="movies-filters__summary-value">
                    От {draftFilters.yearFrom || '...'} до {draftFilters.yearTo || '...'}
                  </span>
                </div>

                <span className="movies-filters__summary-icon" aria-hidden="true">
                  <LuChevronDown />
                </span>
              </summary>

              <div className="movies-filters__dropdown-body">
                <div className="movies-filters__range-grid">
                  <FormItem top="От">
                    <Input
                      type="number"
                      min={MIN_YEAR}
                      max={MAX_YEAR}
                      step={1}
                      value={draftFilters.yearFrom}
                      onChange={(event) =>
                        setDraftFilters((currentFilters) => ({
                          ...currentFilters,
                          yearFrom: event.target.value,
                        }))
                      }
                    />
                  </FormItem>

                  <FormItem top="До">
                    <Input
                      type="number"
                      min={MIN_YEAR}
                      max={MAX_YEAR}
                      step={1}
                      value={draftFilters.yearTo}
                      onChange={(event) =>
                        setDraftFilters((currentFilters) => ({
                          ...currentFilters,
                          yearTo: event.target.value,
                        }))
                      }
                    />
                  </FormItem>
                </div>
              </div>
            </details>
          </div>

          <div className="movies-filters__footer">
            <Button mode="secondary" size="m" onClick={resetDraft}>
              Сбросить
            </Button>

            <Button mode="primary" size="m" onClick={applyFilters} disabled={!hasChanges()}>
              Применить
            </Button>
          </div>
        </div>
      </details>
    </section>
  )
}
