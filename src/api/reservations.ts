import { apiRequest } from './client'
import type { Reservation, ReservationInput } from './types'

export type ReservationChanges = Partial<Omit<ReservationInput, 'spaceId'>>

export const reservationsApi = {
  // POST /reservations (driver) -> the space becomes "reserved"
  create: (input: ReservationInput) =>
    apiRequest<Reservation>('/reservations', { method: 'POST', body: input }),

  // GET /reservations/me -> the logged-in driver's own reservations
  mine: () => apiRequest<Reservation[]>('/reservations/me'),

  // PATCH /reservations/:id -> change plate number or time (active only)
  update: (id: number, changes: ReservationChanges) =>
    apiRequest<Reservation>(`/reservations/${id}`, { method: 'PATCH', body: changes }),

  // PATCH /reservations/:id/cancel -> the space becomes "available" again
  cancel: (id: number) =>
    apiRequest<Reservation>(`/reservations/${id}/cancel`, { method: 'PATCH' }),
}
