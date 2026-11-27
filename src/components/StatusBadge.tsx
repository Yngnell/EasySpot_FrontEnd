import type { ReservationStatus, SpaceStatus } from '../api/types'

const LABELS: Record<SpaceStatus | ReservationStatus, string> = {
  available: 'Available',
  reserved: 'Reserved',
  occupied: 'Occupied',
  maintenance: 'Maintenance',
  active: 'Active',
  checked_in: 'Checked in',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export function StatusBadge({ status }: { status: SpaceStatus | ReservationStatus }) {
  return <span className={`badge badge-${status}`}>{LABELS[status]}</span>
}
