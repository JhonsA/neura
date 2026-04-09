import { CalendarDays, ChevronRight } from 'lucide-react'

import { useMigraineStore } from '@/features/migraine/store'

function getRelativeTime(dateValue: string) {
  const timestamp = Date.parse(dateValue)

  if (Number.isNaN(timestamp)) {
    return 'Fecha no disponible'
  }

  const elapsed = Date.now() - timestamp
  const minutes = Math.floor(elapsed / 60000)

  if (minutes < 1) {
    return 'hace unos segundos'
  }

  if (minutes < 60) {
    return `hace ${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `hace ${hours} h`
  }

  const days = Math.floor(hours / 24)
  return days === 1 ? 'hace 1 día' : `hace ${days} días`
}

function LastMigraineCard() {
  const lastEvent = useMigraineStore((state) => state.events[0])

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

  const relativeTime = getRelativeTime(lastEvent.createdAt)

  return (
    <article className="last-migraine-card" aria-live="polite">
      <span className="last-migraine-icon" aria-hidden="true">
        <CalendarDays size={24} strokeWidth={1.5} />
      </span>
      <span className="last-migraine-text">
        <span className="last-migraine-label">Última migraña</span>
        <span className="last-migraine-value">{relativeTime}</span>
      </span>
      <ChevronRight className="last-migraine-chevron" size={18} strokeWidth={1.8} />
    </article>
  )
}

export default LastMigraineCard
