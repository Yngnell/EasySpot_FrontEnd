import { apiRequest } from './client'
import type { LoginResponse, RegisterInput, User } from './types'

export const authApi = {
  // POST /auth/login -> { access_token, user }
  login: (email: string, password: string) =>
    apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  // POST /auth/register -> new driver account
  register: (input: RegisterInput) =>
    apiRequest<User>('/auth/register', { method: 'POST', body: input }),

  // GET /auth/profile -> the logged-in user (needs the token)
  profile: () => apiRequest<User>('/auth/profile'),
}
