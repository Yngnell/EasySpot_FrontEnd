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

export type SpaceStatus = 'available' | 'reserved' | 'occupied' | 'maintenance'

export type SpaceType = 'regular' | 'compact' | 'pwd' | 'motorcycle' | 'ev'

export interface ParkingLot {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  openingTime: string // "HH:MM:SS"
  closingTime: string
  hourlyRate: number
}

export interface ParkingSpace {
  id: number
  code: string
  type: SpaceType
  status: SpaceStatus
  lotId: number
  lot?: ParkingLot
}

export type ReservationStatus = 'active' | 'checked_in' | 'completed' | 'cancelled'

export interface Reservation {
  id: number
  userId: number
  user?: User
  spaceId: number
  space: ParkingSpace & { lot: ParkingLot }
  plateNumber: string
  startTime: string // ISO date-time
  endTime: string
  status: ReservationStatus
  checkedInAt: string | null
  completedAt: string | null
  totalFee: number | null
  createdAt: string
}

export interface ReservationInput {
  spaceId: number
  plateNumber: string
  startTime: string
  endTime: string
}
