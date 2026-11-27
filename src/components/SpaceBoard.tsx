import type { ParkingSpace, SpaceStatus } from '../api/types'
import { SPACE_TYPE_LABELS } from '../utils/format'

interface Props {
  spaces: ParkingSpace[]
  selectedId?: number | null
  /** Called when a clickable space is clicked */
  onSelect?: (space: ParkingSpace) => void
  /** Which spaces can be clicked (default: none) */
  isSelectable?: (space: ParkingSpace) => boolean
}

const LEGEND: SpaceStatus[] = ['available', 'reserved', 'occupied', 'maintenance']

/** Grid of parking spaces coloured by their live status. */
export function SpaceBoard({ spaces, selectedId, onSelect, isSelectable }: Props) {
  if (spaces.length === 0) {
    return <p className="muted">This lot has no parking spaces yet.</p>
  }

  return (
    <div className="stack">
      <div className="legend">
        {LEGEND.map((status) => (
          <span key={status} className="legend-item">
            <span className={`legend-dot space-${status}`} /> {status}
          </span>
        ))}
      </div>

      <div className="space-grid">
        {spaces.map((space) => {
          const clickable = Boolean(onSelect && isSelectable?.(space))
          return (
            <button
              key={space.id}
              type="button"
              className={`space-tile space-${space.status}${selectedId === space.id ? ' selected' : ''}`}
              disabled={!clickable}
              onClick={() => onSelect?.(space)}
              title={`${space.code} · ${SPACE_TYPE_LABELS[space.type]} · ${space.status}`}
            >
              <span className="space-code">{space.code}</span>
              <span className="space-type">{SPACE_TYPE_LABELS[space.type]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
