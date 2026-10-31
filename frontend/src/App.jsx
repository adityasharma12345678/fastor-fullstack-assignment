import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import ToastProvider from './components/ToastProvider.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import ScrollToTop from './routes/ScrollToTop.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import OtpPage from './pages/OtpPage.jsx'
import RestaurantDetailPage from './pages/RestaurantDetailPage.jsx'
import RestaurantsPage from './pages/RestaurantsPage.jsx'
import SignupPage from './pages/SignupPage.jsx'

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<SignupPage />} />
            <Route path="/otp" element={<OtpPage />} />
            <Route
              path="/restaurants"
              element={
                <ProtectedRoute>
                  <RestaurantsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/restaurants/:id"
              element={
                <ProtectedRoute>
                  <RestaurantDetailPage />
                </ProtectedRoute>
              }
            />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  )
}
