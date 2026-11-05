import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import styles from './AdminLayout.module.css'

export function AdminLayout({ children }: { children: ReactNode }) {
  const { admin, logout } = useAuthContext()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className={styles.layout}>
      <nav className={styles.sidebar}>
        <span className={styles.brand}>Youth Awards</span>
        <span className={styles.admin}>{admin?.name}</span>
        <NavLink to="/admin/nominations">Nominations</NavLink>
        <NavLink to="/admin/nominees">Nominees</NavLink>
        <NavLink to="/admin/categories">Categories</NavLink>
        <NavLink to="/admin/audit-log">Audit log</NavLink>
        <button type="button" onClick={handleLogout} className={`btn btn-sm btn-secondary ${styles.logout}`}>
          Logout
        </button>
      </nav>
      <main className={styles.content}>{children}</main>
    </div>
  )
}
