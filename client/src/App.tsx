import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProfilePage from './pages/ProfilePage'
import RoutinePage from './pages/RoutinePage'
import ChallengesPage from './pages/ChallengesPage'
import AppLayout from './layouts/AppLayout'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminProductFormPage from './pages/admin/AdminProductFormPage'
import AdminIngredientsPage from './pages/admin/AdminIngredientsPage'
import AdminIngredientFormPage from './pages/admin/AdminIngredientFormPage'
import AdminConflictRulesPage from './pages/admin/AdminConflictRulesPage'
import AdminConflictRuleFormPage from './pages/admin/AdminConflictRuleFormPage'
import { useAuthStore } from './store/authStore'
import LandingPage from './pages/LandingPage'
import AiChat from './components/AiChat'
import ToastContainer from './components/ToastContainer'
import ErrorBoundary from './components/ErrorBoundary'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.accessToken)
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, accessToken } = useAuthStore()
  if (!accessToken) return <Navigate to="/login" replace />
  if (user?.role !== 'ADMIN') return <Navigate to="/products" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<LandingPage />} />

          {/* App shell — shared nav */}
          <Route element={<AppLayout />}>
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="/dashboard" element={<Navigate to="/challenges" replace />} />
            <Route path="/routine" element={
              <ProtectedRoute><RoutinePage /></ProtectedRoute>
            } />
            <Route path="/challenges" element={
              <ProtectedRoute><ChallengesPage /></ProtectedRoute>
            } />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={
            <AdminRoute><AdminLayout /></AdminRoute>
          }>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/new" element={<AdminProductFormPage />} />
            <Route path="products/:id/edit" element={<AdminProductFormPage />} />
            <Route path="ingredients" element={<AdminIngredientsPage />} />
            <Route path="ingredients/new" element={<AdminIngredientFormPage />} />
            <Route path="ingredients/:id/edit" element={<AdminIngredientFormPage />} />
            <Route path="conflict-rules" element={<AdminConflictRulesPage />} />
            <Route path="conflict-rules/new" element={<AdminConflictRuleFormPage />} />
            <Route path="conflict-rules/:id/edit" element={<AdminConflictRuleFormPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <AiChat />
      <ToastContainer />
    </ErrorBoundary>
  )
}
