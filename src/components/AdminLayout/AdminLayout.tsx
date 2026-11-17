import { useEffect, useRef, useState, type ReactNode, type SVGProps } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import styles from './AdminLayout.module.css'

const NAV_ITEMS = [
  { to: '/admin/nominations', label: 'Nominations', Icon: NominationsIcon },
  { to: '/admin/nominees', label: 'Nominees', Icon: NomineesIcon },
  { to: '/admin/categories', label: 'Categories', Icon: CategoriesIcon },
  { to: '/admin/audit-log', label: 'Audit log', Icon: AuditIcon },
]

export function AdminLayout({ children }: { children: ReactNode }) {
  const { admin, logout } = useAuthContext()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  async function handleLogout() {
    await logout()
    navigate('/admin/login')
  }

  function closeDrawer() {
    setDrawerOpen(false)
    toggleRef.current?.focus()
  }

  useEffect(() => {
    if (!drawerOpen) return

    const firstLink = drawerRef.current?.querySelector<HTMLElement>('a, button')
    firstLink?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeDrawer()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen])

  const navLinks = (
    <>
      {NAV_ITEMS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
          onClick={closeDrawer}
        >
          <Icon aria-hidden="true" className={styles.navIcon} />
          {label}
        </NavLink>
      ))}
    </>
  )

  return (
    <div className={styles.layout}>
      <header className={styles.topbar}>
        <button
          type="button"
          ref={toggleRef}
          className={styles.menuButton}
          aria-expanded={drawerOpen}
          aria-controls="admin-drawer"
          onClick={() => setDrawerOpen((v) => !v)}
        >
          <MenuIcon aria-hidden="true" />
          <span>Menu</span>
        </button>
        <span className={styles.topbarBrand}>Youth Awards</span>
      </header>

      <aside className={styles.sidebar} aria-label="Admin navigation">
        <span className={styles.brand}>Youth Awards</span>
        <nav className={styles.nav}>{navLinks}</nav>
        <div className={styles.sidebarFooter}>
          <span className={styles.adminName}>{admin?.name}</span>
          <button type="button" onClick={handleLogout} className="btn btn-sm btn-secondary">
            Logout
          </button>
        </div>
      </aside>

      <div
        className={`${styles.backdrop} ${drawerOpen ? styles.backdropOpen : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <div
        id="admin-drawer"
        ref={drawerRef}
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ''}`}
        aria-label="Admin navigation"
        aria-hidden={!drawerOpen}
        inert={!drawerOpen}
      >
        <nav className={styles.nav}>{navLinks}</nav>
        <div className={styles.sidebarFooter}>
          <span className={styles.adminName}>{admin?.name}</span>
          <button type="button" onClick={handleLogout} className="btn btn-sm btn-secondary">
            Logout
          </button>
        </div>
      </div>

      <main className={styles.content}>{children}</main>
    </div>
  )
}

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  )
}

function NominationsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M9 11l3 3 8-8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function NomineesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" strokeLinecap="round" />
    </svg>
  )
}

function CategoriesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  )
}

function AuditIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" strokeLinejoin="round" />
      <path d="M9 12h6M9 16h6" strokeLinecap="round" />
    </svg>
  )
}
