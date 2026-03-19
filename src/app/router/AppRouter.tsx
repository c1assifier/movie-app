import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from '@/app/router/routes'
import { AppLayout } from '@/components/app-layout/AppLayout'
import { ComparePage } from '@/pages/compare'
import { FavoritesPage } from '@/pages/favorites'
import { MovieDetailsPage } from '@/pages/movie-details'
import { MoviesPage } from '@/pages/movies'
import { NotFoundPage } from '@/pages/not-found'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to={ROUTES.movies} replace />} />
          <Route path={ROUTES.movies} element={<MoviesPage />} />
          <Route path={ROUTES.movieDetails} element={<MovieDetailsPage />} />
          <Route path={ROUTES.favorites} element={<FavoritesPage />} />
          <Route path={ROUTES.compare} element={<ComparePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
