import { useCallback, useEffect, useState } from 'react'
import { parkingApi } from '../api/parking'
import { reservationsApi } from '../api/reservations'
import type { ParkingLot, ParkingSpace, Reservation } from '../api/types'
import { SpaceBoard } from '../components/SpaceBoard'
import { SpaceStatusPanel } from '../components/SpaceStatusPanel'
import { StatusBadge } from '../components/StatusBadge'
import { usePolling } from '../hooks/usePolling'
import { formatDateTime, formatPeso } from '../utils/format'

const REFRESH_MS = 5000

export function ParkingDeskPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [lots, setLots] = useState<ParkingLot[]>([])
  const [lotId, setLotId] = useState<number | null>(null)
  const [spaces, setSpaces] = useState<ParkingSpace[]>([])
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    parkingApi
      .listLots()
      .then((result) => {
        setLots(result)
        if (result.length > 0) setLotId(result[0].id)
      })
      .catch((err: Error) => setError(err.message))
  }, [])

  // Reload reservations and the selected lot's spaces every few seconds
  const refresh = useCallback(() => {
    reservationsApi
      .list()
      .then(setReservations)
      .catch((err: Error) => setError(err.message))
    if (lotId !== null) {
      parkingApi
        .lotSpaces(lotId)
        .then(setSpaces)
        .catch((err: Error) => setError(err.message))
    }
  }, [lotId])

  usePolling(refresh, REFRESH_MS)

  const runAction = async (reservation: Reservation, action: 'checkIn' | 'complete') => {
    setError('')
    setMessage('')
    setBusyId(reservation.id)
    try {
      const updated = await reservationsApi[action](reservation.id)
      setMessage(
        action === 'checkIn'
          ? `${updated.plateNumber} checked in at space ${updated.space.code}.`
          : `${updated.plateNumber} left space ${updated.space.code}. Fee: ${formatPeso(updated.totalFee ?? 0)}.`,
      )
      refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusyId(null)
    }
  }

  const open = reservations
    .filter((r) => r.status === 'active' || r.status === 'checked_in')
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
  const recentlyCompleted = reservations
    .filter((r) => r.status === 'completed' && r.completedAt)
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
    .slice(0, 5)

  return (
    <main className="page stack">
      <div>
        <h1>Parking desk</h1>
        <p className="muted">Check drivers in when they arrive and complete their reservation when they leave.</p>
      </div>

      {error && <div className="alert error">{error}</div>}
      {message && <div className="alert success">{message}</div>}

      <section className="stack">
        <h2>Open reservations ({open.length})</h2>
        {open.length === 0 ? (
          <p className="muted">No drivers are expected right now.</p>
        ) : (
          <div className="card table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Space</th>
                  <th>Driver</th>
                  <th>Plate</th>
                  <th>Reserved for</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {open.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.space.code}</strong>
                      <div className="muted small-text">{r.space.lot.name}</div>
                    </td>
                    <td>{r.user?.fullName ?? `User #${r.userId}`}</td>
                    <td>{r.plateNumber}</td>
                    <td>
                      {formatDateTime(r.startTime)}
                      <div className="muted small-text">until {formatDateTime(r.endTime)}</div>
                    </td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                    <td>
                      {r.status === 'active' ? (
                        <button
                          type="button"
                          className="small"
                          disabled={busyId === r.id}
                          onClick={() => runAction(r, 'checkIn')}
                        >
                          Check in
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="small"
                          disabled={busyId === r.id}
                          onClick={() => runAction(r, 'complete')}
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card stack">
        <div className="row spread">
          <h2>Space status</h2>
          <select
            value={lotId ?? ''}
            onChange={(e) => {
              setLotId(Number(e.target.value))
              setSelectedSpace(null)
            }}
          >
            {lots.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
        <SpaceBoard
          spaces={spaces}
          selectedId={selectedSpace?.id}
          onSelect={setSelectedSpace}
          isSelectable={() => true}
        />
        {selectedSpace && (
          <SpaceStatusPanel
            key={selectedSpace.id}
            space={selectedSpace}
            onSaved={() => {
              setMessage(`Space ${selectedSpace.code} updated.`)
              setSelectedSpace(null)
              refresh()
            }}
            onClose={() => setSelectedSpace(null)}
          />
        )}
      </section>

      {recentlyCompleted.length > 0 && (
        <section className="stack">
          <h2>Recently completed</h2>
          <div className="card table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Space</th>
                  <th>Plate</th>
                  <th>Left at</th>
                  <th>Fee</th>
                </tr>
              </thead>
              <tbody>
                {recentlyCompleted.map((r) => (
                  <tr key={r.id}>
                    <td>{r.space.code}</td>
                    <td>{r.plateNumber}</td>
                    <td>{formatDateTime(r.completedAt!)}</td>
                    <td>{formatPeso(r.totalFee ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  )
}
