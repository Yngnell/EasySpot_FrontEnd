import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import { reservationsApi } from '../api/reservations'
import type { Reservation } from '../api/types'
import { EditReservationForm } from '../components/EditReservationForm'
import { StatusBadge } from '../components/StatusBadge'
import { usePolling } from '../hooks/usePolling'
import { formatDateTime, formatPeso } from '../utils/format'

const REFRESH_MS = 10000

export function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[] | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = useCallback(() => {
    reservationsApi
      .mine()
      .then(setReservations)
      .catch((err: Error) => setError(err.message))
  }, [])

  // Refresh so the driver sees when the attendant checks them in or completes
  usePolling(load, REFRESH_MS)

  const handleCancel = async (reservation: Reservation) => {
    if (!window.confirm(`Cancel your reservation for space ${reservation.space.code}?`)) return
    setError('')
    try {
      await reservationsApi.cancel(reservation.id)
      setMessage(`Reservation for ${reservation.space.code} was cancelled.`)
      load()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const current = reservations?.filter((r) => r.status === 'active' || r.status === 'checked_in') ?? []
  const history = reservations?.filter((r) => r.status === 'completed' || r.status === 'cancelled') ?? []

  return (
    <main className="page stack">
      <div className="row spread">
        <div>
          <h1>My reservations</h1>
          <p className="muted">Your current booking and your parking history.</p>
        </div>
        <Link to="/find-parking" className="button-link">
          Reserve a space
        </Link>
      </div>

      {error && <div className="alert error">{error}</div>}
      {message && <div className="alert success">{message}</div>}
      {reservations === null && !error && <p className="muted">Loading…</p>}

      {reservations !== null && (
        <>
          <section className="stack">
            <h2>Current</h2>
            {current.length === 0 && <p className="muted">You have no active reservation.</p>}
            {current.map((r) => (
              <article key={r.id} className="card stack">
                <ReservationSummary reservation={r} />
                {r.status === 'active' && editingId !== r.id && (
                  <div className="row">
                    <button type="button" className="secondary small" onClick={() => setEditingId(r.id)}>
                      Edit
                    </button>
                    <button type="button" className="danger small" onClick={() => handleCancel(r)}>
                      Cancel reservation
                    </button>
                  </div>
                )}
                {r.status === 'checked_in' && (
                  <p className="muted small-text">
                    You are parked. The attendant will complete your reservation when you leave.
                  </p>
                )}
                {editingId === r.id && (
                  <EditReservationForm
                    reservation={r}
                    onSaved={() => {
                      setEditingId(null)
                      setMessage('Reservation updated.')
                      load()
                    }}
                    onClose={() => setEditingId(null)}
                  />
                )}
              </article>
            ))}
          </section>

          <section className="stack">
            <h2>History</h2>
            {history.length === 0 && <p className="muted">No past reservations yet.</p>}
            {history.length > 0 && (
              <div className="card table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Space</th>
                      <th>Lot</th>
                      <th>Plate</th>
                      <th>Reserved for</th>
                      <th>Status</th>
                      <th>Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((r) => (
                      <tr key={r.id}>
                        <td>{r.space.code}</td>
                        <td>{r.space.lot.name}</td>
                        <td>{r.plateNumber}</td>
                        <td>{formatDateTime(r.startTime)}</td>
                        <td>
                          <StatusBadge status={r.status} />
                        </td>
                        <td>{r.totalFee !== null ? formatPeso(r.totalFee) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  )
}

function ReservationSummary({ reservation: r }: { reservation: Reservation }) {
  return (
    <div className="row spread">
      <div>
        <h3>
          Space {r.space.code} · {r.space.lot.name}
        </h3>
        <p className="muted small-text">
          {r.plateNumber} · {formatDateTime(r.startTime)} to {formatDateTime(r.endTime)}
        </p>
      </div>
      <StatusBadge status={r.status} />
    </div>
  )
}
