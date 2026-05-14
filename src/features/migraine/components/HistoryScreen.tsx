import { memo, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { deleteEvent } from '@/features/migraine/migraineSlice'
import { Pagination } from '@/shared/components/Pagination'
import type { MigraineEvent } from '@/features/migraine/types'
import { formatDuration, intensityColor } from '@/features/migraine/utils'
import WaveBackground from './WaveBackground'

const PAGE_SIZE = 5

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
}

// ─── Card ─────────────────────────────────────────────────────────────────────

const HistoryCard = memo(function HistoryCard({ event, onEdit, onDelete }: {
  event: MigraineEvent
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}) {
  const [confirming, setConfirming] = useState(false)
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
          <div className="history-card-actions">
            <button
              className="history-card-edit-btn"
              type="button"
              onClick={() => onEdit(event.id)}
              aria-label="Editar registro"
            >
              <Pencil size={13} strokeWidth={1.8} />
            </button>
            <button
              className="history-card-edit-btn"
              type="button"
              onClick={() => setConfirming(true)}
              aria-label="Eliminar registro"
            >
              <Trash2 size={13} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>

      {confirming && (
        <div className="history-card-confirm">
          <span className="history-card-confirm-text">¿Eliminar este registro?</span>
          <div className="history-card-confirm-actions">
            <button className="history-confirm-btn history-confirm-btn--danger" type="button" onClick={() => onDelete(event.id)}>
              Eliminar
            </button>
            <button className="history-confirm-btn" type="button" onClick={() => setConfirming(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </article>
  )
})

// ─── Screen ───────────────────────────────────────────────────────────────────

function HistoryScreen() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const events   = useAppSelector((state) => state.migraine.events)
  const [page, setPage] = useState(0)

  const totalPages = Math.max(1, Math.ceil(events.length / PAGE_SIZE))
  const slice      = events.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  const handleEdit = useCallback((id: string) => {
    navigate(`/review/${id}`, { state: { returnTo: '/history' } })
  }, [navigate])

  const handleDelete = useCallback((id: string) => {
    dispatch(deleteEvent(id))
  }, [dispatch])

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
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

                        <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
              totalLabel={`${events.length} ${events.length === 1 ? 'registro en total' : 'registros en total'}`}
            />
          </>
        )}
      </section>

      <WaveBackground />
    </main>
  )
}

export default HistoryScreen
