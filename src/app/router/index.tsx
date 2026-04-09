import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { ReviewScreen } from '@/features/migraine'
import { App } from '@/app'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<App />} />
        <Route path="/review" element={<ReviewScreen />} />
        {/* Fallback */}
        <Route path="*"       element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
