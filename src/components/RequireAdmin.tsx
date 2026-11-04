import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { admin, loading } = useAuthContext()

  if (loading) {
    return <p className="page-message">Checking login status…</p>
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
