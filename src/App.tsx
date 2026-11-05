import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { RequireAdmin } from './components/RequireAdmin/RequireAdmin'
import { AdminLayout } from './components/AdminLayout/AdminLayout'
import { HomePage } from './pages/HomePage/HomePage'
import { NominatePage } from './pages/NominatePage/NominatePage'
import { LoginPage } from './pages/admin/LoginPage/LoginPage'
import { NominationsPage } from './pages/admin/NominationsPage/NominationsPage'
import { NomineesPage } from './pages/admin/NomineesPage/NomineesPage'
import { CategoriesPage } from './pages/admin/CategoriesPage/CategoriesPage'
import { AuditLogPage } from './pages/admin/AuditLogPage/AuditLogPage'

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
