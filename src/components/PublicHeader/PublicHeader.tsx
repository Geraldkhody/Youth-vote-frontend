import { Link, NavLink } from 'react-router-dom'
import { EVENT_NAME } from '../../config'
import styles from './PublicHeader.module.css'

// Header shown on public pages only (home, nominate). Admin pages use AdminLayout instead.
export function PublicHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          {EVENT_NAME}
        </Link>
        <nav aria-label="Main">
          <NavLink
            to="/nominate"
            className={({ isActive }) => `${styles.nominateLink} ${isActive ? styles.active : ''}`}
          >
            Nominate
          </NavLink>
          <Link to="/admin/login" className={styles.adminLink}>
            Admin
          </Link>
        </nav>
      </div>
    </header>
  )
}
