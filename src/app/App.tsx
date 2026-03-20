import { Analytics } from '@vercel/analytics/react'
import { AppProviders } from '@/app/providers/AppProviders'
import { AppRouter } from '@/app/router/AppRouter'

function App() {
  return (
    <AppProviders>
      <AppRouter />
      <Analytics />
    </AppProviders>
  )
}

export default App
