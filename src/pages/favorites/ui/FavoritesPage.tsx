import { useFavorites } from '@/app/providers/favorites-context'
import { ROUTES } from '@/app/router/routes'
import { MovieCard } from '@/components/movie-card/MovieCard'
import { InfoCard } from '@/components/info-card/InfoCard'
import '@/pages/movies/ui/MoviesPage.css'

export function FavoritesPage() {
  const { favorites, removeFromFavorites } = useFavorites()

  if (favorites.length === 0) {
    return (
      <InfoCard
        title="Избранное"
        description="Вы пока не добавили ни одного фильма. Вернитесь в каталог и соберите свой список."
      />
    )
  }

  return (
    <section className="movies-page">
      <header className="movies-page__header">
        <div className="movies-page__title-block">
          <h1 className="movies-page__title">Избранное</h1>
        </div>

        <span className="movies-page__meta">Фильмов: {favorites.length}</span>
      </header>

      <div className="movies-page__grid">
        {favorites.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            detailsState={{ from: ROUTES.favorites }}
            isFavorite
            onFavoriteToggle={() => removeFromFavorites(movie.id)}
          />
        ))}
      </div>
    </section>
  )
}
