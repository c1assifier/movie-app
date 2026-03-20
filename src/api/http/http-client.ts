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
  const searchParams = query ? createSearchParams(query) : new URLSearchParams()
  const requestUrl = `${apiConfig.baseUrl}${path}${searchParams.size ? `?${searchParams}` : ''}`

  const response = await fetch(requestUrl, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status)
  }

  const contentType = response.headers.get('content-type') || ''

  if (!contentType.includes('application/json')) {
    throw new ApiError('API returned a non-JSON response', response.status)
  }

  return response.json() as Promise<T>
}
