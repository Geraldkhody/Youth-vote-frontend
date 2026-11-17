import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { EVENT_NAME } from '../../config'
import { Button } from '../ui/Button/Button'
import styles from './PublicHeader.module.css'

// Header shown on public pages only (home, nominate, nominees). Admin pages use AdminLayout instead.
export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const navLinkClass = ({ isActive }: { isActive: boolean }) => `${styles.navLink} ${isActive ? styles.active : ''}`

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} onClick={() => setMenuOpen(false)}>
          {EVENT_NAME}
        </Link>

        <nav className={styles.nav} aria-label="Main">
          <NavLink to="/nominees" className={navLinkClass}>
            Nominees
          </NavLink>
          <Link to="/admin/login" className={styles.adminLink}>
            Admin
          </Link>
          <Button to="/nominate" className={styles.nominateButton}>
            Nominate
          </Button>
        </nav>

        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`} aria-hidden="true" />
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobilePanel} id="mobile-menu">
          <NavLink to="/nominees" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            Nominees
          </NavLink>
          <Link to="/admin/login" className={styles.adminLink} onClick={() => setMenuOpen(false)}>
            Admin
          </Link>
          <Button to="/nominate" className={styles.mobileNominate} onClick={() => setMenuOpen(false)}>
            Nominate
          </Button>
        </div>
      )}
    </header>
  )
}
