import { useState } from 'react'
import { parkingApi } from '../api/parking'
import type { ParkingSpace, SpaceStatus } from '../api/types'
import { SPACE_TYPE_LABELS } from '../utils/format'
import { StatusBadge } from './StatusBadge'

const STATUSES: SpaceStatus[] = ['available', 'reserved', 'occupied', 'maintenance']

interface Props {
  space: ParkingSpace
  onSaved: () => void
  onClose: () => void
}

/** Lets an attendant change one space's status on the ground (e.g. maintenance). */
export function SpaceStatusPanel({ space, onSaved, onClose }: Props) {
  const [status, setStatus] = useState<SpaceStatus>(space.status)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setError('')
    setSaving(true)
    try {
      await parkingApi.updateSpaceStatus(space.id, status)
      onSaved()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="stack status-panel">
      <div className="row spread">
        <strong>
          Space {space.code} · {SPACE_TYPE_LABELS[space.type]}
        </strong>
        <StatusBadge status={space.status} />
      </div>
      {error && <div className="alert error">{error}</div>}
      <div className="row">
        <select value={status} onChange={(e) => setStatus(e.target.value as SpaceStatus)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="button" className="small" onClick={save} disabled={saving || status === space.status}>
          {saving ? 'Saving…' : 'Update status'}
        </button>
        <button type="button" className="secondary small" onClick={onClose}>
          Close
        </button>
      </div>
      <p className="muted small-text">
        Reserved and occupied are normally set by bookings and check-ins. Use this for walk-ins or
        to close a space for maintenance.
      </p>
    </div>
  )
}
