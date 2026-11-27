import { apiRequest } from './client'
import type { ParkingLot, ParkingSpace, SpaceStatus } from './types'

export const parkingApi = {
  // GET /parking-lots
  listLots: () => apiRequest<ParkingLot[]>('/parking-lots'),

  // GET /parking-lots/:lotId/spaces
  lotSpaces: (lotId: number) => apiRequest<ParkingSpace[]>(`/parking-lots/${lotId}/spaces`),

  // PATCH /parking-spaces/:id/status (attendant, admin)
  updateSpaceStatus: (id: number, status: SpaceStatus) =>
    apiRequest<ParkingSpace>(`/parking-spaces/${id}/status`, {
      method: 'PATCH',
      body: { status },
    }),
}
