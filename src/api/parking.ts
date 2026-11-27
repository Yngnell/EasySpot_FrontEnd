import { apiRequest } from './client'
import type { ParkingLot, ParkingSpace } from './types'

export const parkingApi = {
  // GET /parking-lots
  listLots: () => apiRequest<ParkingLot[]>('/parking-lots'),

  // GET /parking-lots/:lotId/spaces
  lotSpaces: (lotId: number) => apiRequest<ParkingSpace[]>(`/parking-lots/${lotId}/spaces`),
}
