import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { RequireAdmin } from './components/RequireAdmin'
import { AdminLayout } from './components/AdminLayout'
import { HomePage } from './pages/HomePage'
import { NominatePage } from './pages/NominatePage'
import { LoginPage } from './pages/admin/LoginPage'
import { NominationsPage } from './pages/admin/NominationsPage'
import { NomineesPage } from './pages/admin/NomineesPage'
import { CategoriesPage } from './pages/admin/CategoriesPage'
import { AuditLogPage } from './pages/admin/AuditLogPage'

function NotFound() {
  return <p className="page-message">Page not found.</p>
}

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nominate" element={<NominatePage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin/nominations"
          element={
            <RequireAdmin>
              <AdminLayout>
                <NominationsPage />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/nominees"
          element={
            <RequireAdmin>
              <AdminLayout>
                <NomineesPage />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <RequireAdmin>
              <AdminLayout>
                <CategoriesPage />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/audit-log"
          element={
            <RequireAdmin>
              <AdminLayout>
                <AuditLogPage />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}
