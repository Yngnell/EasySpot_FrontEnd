// Shapes of the JSON returned by the EasySpot backend API.

export type Role = 'driver' | 'attendant' | 'admin'

export interface User {
  id: number
  fullName: string
  email: string
  role: Role
  phone: string | null
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  access_token: string
  token_type: 'Bearer'
  user: User
}

export interface RegisterInput {
  fullName: string
  email: string
  password: string
  phone?: string
}
