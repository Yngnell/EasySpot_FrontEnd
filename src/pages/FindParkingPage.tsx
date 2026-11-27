import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { parkingApi } from '../api/parking'
import type { ParkingLot, ParkingSpace, Reservation } from '../api/types'
import { ReserveForm } from '../components/ReserveForm'
import { SpaceBoard } from '../components/SpaceBoard'
import { usePolling } from '../hooks/usePolling'
import { formatPeso, formatTime, mapsLink } from '../utils/format'

const REFRESH_MS = 5000

export function FindParkingPage() {
  const [lots, setLots] = useState<ParkingLot[]>([])
  const [lotId, setLotId] = useState<number | null>(null)
  const [spaces, setSpaces] = useState<ParkingSpace[]>([])
  const [selected, setSelected] = useState<ParkingSpace | null>(null)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const [error, setError] = useState('')
  const [booked, setBooked] = useState<Reservation | null>(null)

  // Load the parking lots once and pick the first one
  useEffect(() => {
    parkingApi
      .listLots()
      .then((result) => {
        setLots(result)
        if (result.length > 0) setLotId(result[0].id)
      })
      .catch((err: Error) => setError(err.message))
  }, [])

  // Reload the selected lot's spaces every few seconds ("live" board)
  const loadSpaces = useCallback(() => {
    if (lotId === null) return
    parkingApi
      .lotSpaces(lotId)
      .then((result) => {
        setSpaces(result)
        setUpdatedAt(new Date())
      })
      .catch((err: Error) => setError(err.message))
  }, [lotId])

  usePolling(loadSpaces, REFRESH_MS, lotId !== null)

  const lot = lots.find((l) => l.id === lotId) ?? null
  const availableCount = spaces.filter((s) => s.status === 'available').length

  const chooseLot = (id: number) => {
    setLotId(id)
    setSpaces([])
    setSelected(null)
  }

  const handleReserved = (reservation: Reservation) => {
    setBooked(reservation)
    setSelected(null)
    loadSpaces()
  }

  return (
    <main className="page stack">
      <div>
        <h1>Find parking</h1>
        <p className="muted">Pick a parking lot, then click a green space to reserve it.</p>
      </div>

      {error && <div className="alert error">{error}</div>}
      {booked && (
        <div className="alert success">
          Space {booked.space.code} is reserved for {booked.plateNumber}.{' '}
          <Link to="/my-reservations">View my reservations</Link>
        </div>
      )}

      <div className="parking-layout">
        <aside className="stack">
          {lots.map((l) => (
            <button
              key={l.id}
              type="button"
              className={`lot-card${l.id === lotId ? ' selected' : ''}`}
              onClick={() => chooseLot(l.id)}
            >
              <strong>{l.name}</strong>
              <span className="muted small-text">{l.address}</span>
              <span className="small-text">
                {formatTime(l.openingTime)}–{formatTime(l.closingTime)} · {formatPeso(l.hourlyRate)}/hour
              </span>
            </button>
          ))}
          {lots.length === 0 && !error && <p className="muted">No parking lots yet.</p>}
        </aside>

        <section className="stack">
          {lot && (
            <div className="card stack">
              <div className="row spread">
                <div>
                  <h2>{lot.name}</h2>
                  <p className="muted small-text">
                    {availableCount} of {spaces.length} spaces available
                    {updatedAt && ` · updated ${updatedAt.toLocaleTimeString()}`}
                  </p>
                </div>
                <a href={mapsLink(lot.latitude, lot.longitude)} target="_blank" rel="noreferrer">
                  Open in Google Maps ↗
                </a>
              </div>

              <SpaceBoard
                spaces={spaces}
                selectedId={selected?.id}
                onSelect={(space) => {
                  setSelected(space)
                  setBooked(null)
                }}
                isSelectable={(space) => space.status === 'available'}
              />
            </div>
          )}

          {lot && selected && (
            <ReserveForm
              key={selected.id}
              space={selected}
              lot={lot}
              onReserved={handleReserved}
              onCancel={() => setSelected(null)}
            />
          )}
        </section>
      </div>
    </main>
  )
}
