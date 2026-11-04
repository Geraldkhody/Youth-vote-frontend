import { createContext, useContext, type ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'

// Wraps useAuth in a context so every component sees the same admin state,
// instead of each one calling /api/auth/me on its own.
const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
