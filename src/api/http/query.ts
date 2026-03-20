type QueryValue = string | number | boolean | null | undefined
type QueryEntry = QueryValue | QueryValue[]

export function createSearchParams(query: Record<string, QueryEntry>) {
  const searchParams = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === undefined || item === null || item === '') {
          return
        }

        searchParams.append(key, String(item))
      })

      return
    }

    searchParams.append(key, String(value))
  })

  return searchParams
}
