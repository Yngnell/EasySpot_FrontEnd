import type { SpaceType } from '../api/types'

const pesoFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })

export function formatPeso(amount: number): string {
  return pesoFormatter.format(amount)
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })
}

/** "06:00:00" -> "06:00" */
export function formatTime(time: string): string {
  return time.slice(0, 5)
}

/** Date -> "YYYY-MM-DDTHH:mm" in local time, the format <input type="datetime-local"> uses. */
export function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  )
}

export const SPACE_TYPE_LABELS: Record<SpaceType, string> = {
  regular: 'Regular',
  compact: 'Compact',
  pwd: 'PWD',
  motorcycle: 'Motorcycle',
  ev: 'EV charging',
}

/** Link that opens the lot's coordinates in Google Maps (no API key needed). */
export function mapsLink(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
}
