import { createContext, useContext } from 'react'
import type { RegisterInput, Role, User } from '../api/types'

export interface AuthState {
  /** The logged-in user, or null when logged out */
  user: User | null
  /** True while checking a saved token on page load */
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (input: RegisterInput) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthState | null>(null)

export function useAuth(): AuthState {
  const auth = useContext(AuthContext)
  if (!auth) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return auth
}

/** The first page each role lands on after logging in. */
export function homePathFor(role: Role): string {
  return role === 'driver' ? '/find-parking' : '/desk'
}
