import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil } from 'lucide-react'

import { useAppSelector } from '@/app/hooks'
import type { MigraineEvent } from '@/features/migraine/types'
import WaveBackground from './WaveBackground'

const PAGE_SIZE = 8

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
}

function formatDuration(startIso: string, endIso?: string): string {
  if (!endIso) return ''
  const secs = Math.max(0, Math.round((Date.parse(endIso) - Date.parse(startIso)) / 1000))
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  if (h > 0 && m > 0) return `${h}h ${m}min`
  if (h > 0) return `${h}h`
  if (m > 0) return `${m} min`
  return `${secs} seg`
}

function intensityColor(n: number | null): string {
  if (n === null) return 'var(--c-text-muted)'
  if (n <= 3) return '#6db8a0'
  if (n <= 6) return '#d4a84b'
  return '#c26b6b'
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function HistoryCard({ event, onEdit }: { event: MigraineEvent; onEdit: () => void }) {
  const duration = formatDuration(event.createdAt, event.endedAt)

  return (
    <article className="history-card">
      <div className="history-card-main">
        <div className="history-card-left">
          <span className="history-card-date">{formatDate(event.createdAt)}</span>
          <span className="history-card-time">{formatTime(event.createdAt)}{event.endedAt ? ` – ${formatTime(event.endedAt)}` : ''}</span>
          {duration && <span className="history-card-duration">{duration}</span>}
        </div>

        <div className="history-card-right">
          {event.intensity !== null && (
            <div className="history-card-intensity-wrap">
              <span className="history-card-intensity-label">intensidad</span>
              <span
                className="history-card-intensity"
                style={{ color: intensityColor(event.intensity) }}
                aria-label={`Intensidad ${event.intensity}`}
              >
                {event.intensity}
              </span>
            </div>
          )}
          <button
            className="history-card-edit-btn"
            type="button"
            onClick={onEdit}
            aria-label="Editar registro"
          >
            <Pencil size={13} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </article>
  )
}

// ─── Screen ───────────────────────────────────────────────────────────────────

function HistoryScreen() {
  const navigate = useNavigate()
  const events   = useAppSelector((state) => state.migraine.events)
  const [page, setPage] = useState(0)

  const totalPages = Math.max(1, Math.ceil(events.length / PAGE_SIZE))
  const slice      = events.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  const handleEdit = (id: string) => {
    navigate(`/review/${id}`, { state: { returnTo: '/history' } })
  }

  return (
    <main className="neura-screen" aria-label="Historial de migrañas">
      <header className="neura-screen-header">
        <button className="neura-back-btn" type="button" onClick={() => navigate('/')} aria-label="Volver">
          <ArrowLeft size={20} strokeWidth={1.8} />
        </button>
      </header>

      <section className="neura-screen-body">
        <div className="neura-screen-hero">
          <h1 className="neura-screen-title">Historial</h1>
          <p className="neura-screen-subtitle">{events.length} {events.length === 1 ? 'registro' : 'registros'}</p>
        </div>

        {events.length === 0 ? (
          <p className="history-empty">Aún no hay registros.</p>
        ) : (
          <>
            <div className="history-list" aria-label="Lista de migrañas">
              {slice.map((event) => (
                <HistoryCard
                  key={event.id}
                  event={event}
                  onEdit={() => handleEdit(event.id)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="history-pagination" aria-label="Paginación">
                <button
                  className="history-page-btn"
                  type="button"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  aria-label="Página anterior"
                >
                  ‹
                </button>
                <span className="history-page-info">{page + 1} / {totalPages}</span>
                <button
                  className="history-page-btn"
                  type="button"
                  disabled={page === totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  aria-label="Página siguiente"
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <WaveBackground />
    </main>
  )
}

export default HistoryScreen
