import { useState, type FormEvent } from 'react'
import { reservationsApi } from '../api/reservations'
import type { ParkingLot, ParkingSpace, Reservation } from '../api/types'
import { formatPeso, SPACE_TYPE_LABELS, toLocalInputValue } from '../utils/format'

interface Props {
  space: ParkingSpace
  lot: ParkingLot
  onReserved: (reservation: Reservation) => void
  onCancel: () => void
}

const HOUR = 60 * 60 * 1000

export function ReserveForm({ space, lot, onReserved, onCancel }: Props) {
  const [plateNumber, setPlateNumber] = useState('')
  const [start, setStart] = useState(() => toLocalInputValue(new Date(Date.now() + 15 * 60 * 1000)))
  const [end, setEnd] = useState(() => toLocalInputValue(new Date(Date.now() + 15 * 60 * 1000 + 2 * HOUR)))
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Same rule as the backend: every started hour is charged
  const hours = Math.max(1, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / HOUR))
  const estimate = Number.isFinite(hours) ? hours * lot.hourlyRate : 0

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const reservation = await reservationsApi.create({
        spaceId: space.id,
        plateNumber,
        // datetime-local gives local time; the API expects ISO 8601
        startTime: new Date(start).toISOString(),
        endTime: new Date(end).toISOString(),
      })
      onReserved(reservation)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="card stack reserve-form" onSubmit={handleSubmit}>
      <div>
        <h2>Reserve space {space.code}</h2>
        <p className="muted">
          {lot.name} · {SPACE_TYPE_LABELS[space.type]} · {formatPeso(lot.hourlyRate)}/hour
        </p>
      </div>

      {error && <div className="alert error">{error}</div>}

      <label>
        Plate number
        <input
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
          placeholder="ABC 1234"
          required
        />
      </label>
      <div className="form-grid">
        <label>
          Arrival
          <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
        </label>
        <label>
          Leave by
          <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />
        </label>
      </div>

      <p className="muted small-text">
        Estimated fee: <strong>{formatPeso(estimate)}</strong> ({hours} h). You pay for the actual time
        parked when the attendant completes your reservation.
      </p>

      <div className="row">
        <button type="submit" disabled={submitting}>
          {submitting ? 'Reserving…' : 'Reserve space'}
        </button>
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
