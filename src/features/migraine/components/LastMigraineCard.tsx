import { useEffect, useState } from 'react'

import { Activity, CalendarDays, ChevronRight } from 'lucide-react'

import { useMigraineStore } from '@/features/migraine/store'

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

  const now    = Date.now()
  const diff   = now - ts
  const mins   = Math.floor(diff / 60_000)

  if (mins < 1)  return 'hace unos segundos'
  if (mins < 60) return `hace ${mins} min`

  // Same calendar day → "Hoy, HH:MM"
  const date = new Date(ts)
  const today = new Date()
  const timeStr = date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })

  if (date.toDateString() === today.toDateString()) {
    return `Hoy, ${timeStr}`
  }

  // Yesterday
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return `Ayer, ${timeStr}`
  }

  // Older → "Lun 7 abr, HH:MM"
  const dayStr = date.toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' })
  return `${dayStr}, ${timeStr}`
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
  const activeSession = useMigraineStore((state) => state.activeSession)
  const lastEvent     = useMigraineStore((state) => state.events[0])
  const [, tick] = useState(0)

  useEffect(() => {
    if (!activeSession) return
    const id = setInterval(() => tick((n) => n + 1), 1000)
    return () => clearInterval(id)
  }, [activeSession])

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

  const smartTime = getSmartTime(lastEvent.createdAt)
  const duration  = getDuration(lastEvent.createdAt, lastEvent.endedAt)

  return (
    <article className="last-migraine-card" aria-live="polite">
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
