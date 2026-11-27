import { apiRequest } from './client'
import type { Reservation, ReservationInput } from './types'

export const reservationsApi = {
  // POST /reservations (driver) -> the space becomes "reserved"
  create: (input: ReservationInput) =>
    apiRequest<Reservation>('/reservations', { method: 'POST', body: input }),
}
