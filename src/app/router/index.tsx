import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { App } from '@/app'

const ReviewScreen  = lazy(() => import('@/features/migraine/components/ReviewScreen'))
const HistoryScreen = lazy(() => import('@/features/migraine/components/HistoryScreen'))

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/"           element={<App />} />
          <Route path="/review"     element={<ReviewScreen />} />
          <Route path="/review/:id" element={<ReviewScreen />} />
          <Route path="/history"    element={<HistoryScreen />} />
          {/* Fallback */}
          <Route path="*"           element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
