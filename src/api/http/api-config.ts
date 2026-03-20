const DEFAULT_API_URL = 'https://api.kinopoisk.dev/v1.4'

export const apiConfig = {
  baseUrl: __POISKKINO_API_URL__ || DEFAULT_API_URL,
  apiKey: __POISKKINO_API_KEY__,
}
