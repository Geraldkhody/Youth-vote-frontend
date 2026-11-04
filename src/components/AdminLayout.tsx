import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

export function AdminLayout({ children }: { children: ReactNode }) {
  const { admin, logout } = useAuthContext()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <span className="admin-sidebar__brand">Youth Awards</span>
        <span className="admin-sidebar__admin">{admin?.name}</span>
        <NavLink to="/admin/nominations">Nominations</NavLink>
        <NavLink to="/admin/nominees">Nominees</NavLink>
        <NavLink to="/admin/categories">Categories</NavLink>
        <NavLink to="/admin/audit-log">Audit log</NavLink>
        <button type="button" onClick={handleLogout} className="btn btn-sm btn-secondary admin-sidebar__logout">
          Logout
        </button>
      </nav>
      <main className="admin-content">{children}</main>
    </div>
  )
}
