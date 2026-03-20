import { apiConfig } from '@/api/http/api-config'
import { createSearchParams } from '@/api/http/query'

type RequestOptions = {
  path: string
  query?: Record<string, string | number | boolean | null | undefined | Array<string | number>>
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function requestJson<T>({ path, query }: RequestOptions): Promise<T> {
  if (!apiConfig.apiKey) {
    throw new ApiError('POISKKINO_API_KEY is not configured', 500)
  }

  const searchParams = query ? createSearchParams(query) : new URLSearchParams()
  const requestUrl = `${apiConfig.baseUrl}${path}${searchParams.size ? `?${searchParams}` : ''}`

  const response = await fetch(requestUrl, {
    headers: {
      'X-API-KEY': apiConfig.apiKey,
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status)
  }

  return response.json() as Promise<T>
}
