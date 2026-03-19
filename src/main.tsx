import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@vkontakte/vkui/dist/vkui.css'
import App from '@/app/App'
import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
