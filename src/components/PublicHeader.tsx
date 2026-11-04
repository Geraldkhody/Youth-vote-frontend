import { Link, NavLink } from 'react-router-dom'
import { EVENT_NAME } from '../config'

// Header shown on public pages only (home, nominate). Admin pages use AdminLayout instead.
export function PublicHeader() {
  return (
    <header className="public-header">
      <div className="public-header__inner">
        <Link to="/" className="public-header__brand">
          {EVENT_NAME}
        </Link>
        <nav aria-label="Main">
          <NavLink to="/nominate" className="public-header__nominate-link">
            Nominate
          </NavLink>
          <Link to="/admin/login" className="public-header__admin-link">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  )
}
