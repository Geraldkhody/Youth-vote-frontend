import { useCallback, useEffect, useState } from 'react'
import { getCurrentAdmin, login as apiLogin, logout as apiLogout, type Admin } from '../api/client'

export function useAuth() {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentAdmin()
      .then(setAdmin)
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const loggedInAdmin = await apiLogin(email, password)
    setAdmin(loggedInAdmin)
    return loggedInAdmin
  }, [])

  const logout = useCallback(async () => {
    await apiLogout()
    setAdmin(null)
  }, [])

  return { admin, loading, login, logout }
}
