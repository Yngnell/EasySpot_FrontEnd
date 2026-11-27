import { useState, type FormEvent } from 'react'
import { reservationsApi } from '../api/reservations'
import type { Reservation } from '../api/types'
import { toLocalInputValue } from '../utils/format'

interface Props {
  reservation: Reservation
  onSaved: (updated: Reservation) => void
  onClose: () => void
}

export function EditReservationForm({ reservation, onSaved, onClose }: Props) {
  const [plateNumber, setPlateNumber] = useState(reservation.plateNumber)
  const [start, setStart] = useState(toLocalInputValue(new Date(reservation.startTime)))
  const [end, setEnd] = useState(toLocalInputValue(new Date(reservation.endTime)))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSaving(true)

    // Only send what actually changed (PATCH = partial update)
    const changes: { plateNumber?: string; startTime?: string; endTime?: string } = {}
    if (plateNumber !== reservation.plateNumber) changes.plateNumber = plateNumber
    if (start !== toLocalInputValue(new Date(reservation.startTime))) {
      changes.startTime = new Date(start).toISOString()
    }
    if (end !== toLocalInputValue(new Date(reservation.endTime))) {
      changes.endTime = new Date(end).toISOString()
    }

    try {
      onSaved(await reservationsApi.update(reservation.id, changes))
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="stack edit-form" onSubmit={handleSubmit}>
      {error && <div className="alert error">{error}</div>}
      <div className="form-grid">
        <label>
          Plate number
          <input value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} required />
        </label>
        <label>
          Arrival
          <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
        </label>
        <label>
          Leave by
          <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />
        </label>
      </div>
      <div className="row">
        <button type="submit" className="small" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        <button type="button" className="secondary small" onClick={onClose}>
          Close
        </button>
      </div>
    </form>
  )
}
