import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authApi } from '../api/auth'
import { LOGOUT_EVENT, tokenStorage } from '../api/client'
import type { RegisterInput, User } from '../api/types'
import { AuthContext, type AuthState } from './auth-context'

/** Keeps track of who is logged in and shares it with every page. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(() => tokenStorage.get() !== null)

  // On page load: if a token was saved, ask the backend who it belongs to
  useEffect(() => {
    if (!tokenStorage.get()) return
    authApi
      .profile()
      .then(setUser)
      .catch(() => tokenStorage.clear())
      .finally(() => setLoading(false))
  }, [])

  // The API client fires this event when the backend answers 401
  useEffect(() => {
    const handleLogout = () => setUser(null)
    window.addEventListener(LOGOUT_EVENT, handleLogout)
    return () => window.removeEventListener(LOGOUT_EVENT, handleLogout)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login(email, password)
    tokenStorage.set(result.access_token)
    setUser(result.user)
    return result.user
  }, [])

  const register = useCallback(async (input: RegisterInput) => {
    await authApi.register(input)
  }, [])

  const logout = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
  }, [])

  const value = useMemo<AuthState>(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
