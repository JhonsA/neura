import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Activity, CalendarDays, ChevronRight } from 'lucide-react'

import { useAppSelector } from '@/app/hooks'

function formatElapsed(startIso: string): string {
  const elapsed = Math.max(0, Math.floor((Date.now() - Date.parse(startIso)) / 1000))
  const hours   = Math.floor(elapsed / 3600)
  const minutes = Math.floor((elapsed % 3600) / 60)
  const seconds = elapsed % 60

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function getSmartTime(isoDate: string): string {
  const ts = Date.parse(isoDate)
  if (Number.isNaN(ts)) return 'Fecha no disponible'

  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)

  if (mins < 1)   return 'hace unos segundos'
  if (mins < 60)  return `hace ${mins} min`
  if (hours < 24) return hours === 1 ? 'hace 1 hora' : `hace ${hours} horas`

  const date = new Date(ts)
  const today = new Date()

  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return 'ayer'

  return date.toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' })
}

function getDuration(startIso: string, endIso?: string): string {
  if (!endIso) return ''
  const secs = Math.max(0, Math.round((Date.parse(endIso) - Date.parse(startIso)) / 1000))
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  if (h > 0) return `${h}h ${m}min`
  if (m > 0) return `${m} min`
  return `${secs} seg`
}

function LastMigraineCard() {
  const navigate      = useNavigate()
  const activeSession = useAppSelector((state) => state.migraine.activeSession)
  const lastEvent     = useAppSelector((state) => state.migraine.events[0])
  const [, tick] = useState(0)

  // Ticker for the live crisis counter only — "última migraña" doesn't need one
  // because it's a static glance value, recalculated on each render/navigation.
  useEffect(() => {
    if (!activeSession) return
    const id = setInterval(() => tick((n) => n + 1), 1_000)
    return () => clearInterval(id)
  }, [activeSession])

  // Adaptive ticker for the "última migraña" relative label.
  // Interval shrinks when the event is recent, grows when it's old.
  // Stops entirely once >= 24h (label becomes static "ayer" / date).
  useEffect(() => {
    if (activeSession || !lastEvent) return
    const endTs = Date.parse(lastEvent.endedAt ?? lastEvent.createdAt)
    const age   = Date.now() - endTs
    const hours = age / 3_600_000

    // Already showing a static date — no ticker needed
    if (hours >= 24) return

    // < 1h: update every 30s so "hace X min" stays accurate
    // 1–24h: update every 5min so "hace X horas" stays accurate
    const interval = hours < 1 ? 30_000 : 5 * 60_000
    const id = setInterval(() => tick((n) => n + 1), interval)
    return () => clearInterval(id)
  }, [activeSession, lastEvent])



  if (activeSession) {
    return (
      <article className="last-migraine-card" aria-live="polite">
        <span className="last-migraine-icon" aria-hidden="true">
          <Activity size={24} strokeWidth={1.5} />
        </span>
        <span className="last-migraine-text">
          <span className="last-migraine-label">Migraña activa</span>
          <span className="last-migraine-value">En curso&nbsp;•&nbsp;{formatElapsed(activeSession)}</span>
        </span>
        <ChevronRight className="last-migraine-chevron" size={18} strokeWidth={1.8} />
      </article>
    )
  }

  if (!lastEvent) {
    return (
      <article className="last-migraine-card" aria-live="polite">
        <span className="last-migraine-icon" aria-hidden="true">
          <CalendarDays size={24} strokeWidth={1.5} />
        </span>
        <span className="last-migraine-text">
          <span className="last-migraine-label">Última migraña</span>
          <span className="last-migraine-value">Sin registros aún</span>
        </span>
        <ChevronRight className="last-migraine-chevron" size={18} strokeWidth={1.8} />
      </article>
    )
  }

  const smartTime = getSmartTime(lastEvent.endedAt ?? lastEvent.createdAt)
  const duration  = getDuration(lastEvent.createdAt, lastEvent.endedAt)

  const handleEditClick = () => {
    navigate(`/review/${lastEvent.id}`)
  }

  return (
    <article
      className="last-migraine-card"
      aria-live="polite"
      role="button"
      tabIndex={0}
      onClick={handleEditClick}
      onKeyDown={(e) => e.key === 'Enter' && handleEditClick()}
      aria-label="Editar última migraña"
    >
      <span className="last-migraine-icon" aria-hidden="true">
        <CalendarDays size={24} strokeWidth={1.5} />
      </span>
      <span className="last-migraine-text">
        <span className="last-migraine-label">Última migraña</span>
        <span className="last-migraine-value">
          {smartTime}{duration ? <>&nbsp;&bull;&nbsp;{duration}</> : null}
        </span>
      </span>
      <ChevronRight className="last-migraine-chevron" size={18} strokeWidth={1.8} />
    </article>
  )
}

export default LastMigraineCard
