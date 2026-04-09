import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock } from 'lucide-react'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { cancelReview, updatePendingTimes } from '@/features/migraine/migraineSlice'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDuration(startIso: string, endIso: string): string {
  const secs = Math.max(0, Math.round((Date.parse(endIso) - Date.parse(startIso)) / 1000))
  const h    = Math.floor(secs / 3600)
  const m    = Math.floor((secs % 3600) / 60)
  if (h > 0 && m > 0) return `${h}h ${m}min`
  if (h > 0)          return `${h}h`
  if (m > 0)          return `${m} min`
  return `${secs} seg`
}

/** Convert ISO string to value accepted by <input type="datetime-local"> */
function toDatetimeLocal(iso: string): string {
  const d = new Date(iso)
  // Shift to local time for the input
  const offset = d.getTimezoneOffset() * 60_000
  return new Date(d.getTime() - offset).toISOString().slice(0, 16)
}

/** Convert datetime-local value back to ISO string */
function fromDatetimeLocal(value: string): string {
  return new Date(value).toISOString()
}

function formatDisplay(iso: string): string {
  return new Date(iso).toLocaleTimeString('es', {
    hour:   '2-digit',
    minute: '2-digit',
    day:    'numeric',
    month:  'short',
  })
}

// ─── Component ───────────────────────────────────────────────────────────────

function ReviewScreen() {
  const navigate    = useNavigate()
  const dispatch    = useAppDispatch()
  const pending     = useAppSelector((state) => state.migraine.pendingEvent)
  const [editing, setEditing] = useState(false)

  // Guard: if no pending event, redirect home
  useEffect(() => {
    if (!pending) navigate('/', { replace: true })
  }, [pending, navigate])

  if (!pending) return null

  const duration = formatDuration(pending.createdAt, pending.endedAt)

  const handleCancel = () => {
    dispatch(cancelReview())
    navigate('/', { replace: true })
  }

  const handleContinue = () => {
    navigate('/form')
  }

  return (
    <main className="neura-screen" aria-label="Revisar tiempos de la migraña">
      <header className="neura-screen-header">
        <button className="neura-back-btn" onClick={handleCancel} type="button" aria-label="Cancelar y volver">
          <ArrowLeft size={20} strokeWidth={1.8} />
        </button>
      </header>

      <section className="neura-screen-body">
        <div className="review-icon-wrap" aria-hidden="true">
          <Clock size={28} strokeWidth={1.5} />
        </div>

        <h1 className="neura-screen-title">Migraña registrada</h1>

        <p className="review-duration" aria-label={`Duración: ${duration}`}>
          <span className="review-duration-label">Duración</span>
          <span className="review-duration-value">{duration}</span>
        </p>

        <div className="review-times">
          {editing ? (
            <>
              <label className="review-time-row">
                <span className="review-time-label">Inicio</span>
                <input
                  className="review-time-input"
                  type="datetime-local"
                  defaultValue={toDatetimeLocal(pending.createdAt)}
                  max={toDatetimeLocal(pending.endedAt)}
                  onChange={(e) =>
                    dispatch(updatePendingTimes({ createdAt: fromDatetimeLocal(e.target.value) }))
                  }
                />
              </label>
              <label className="review-time-row">
                <span className="review-time-label">Fin</span>
                <input
                  className="review-time-input"
                  type="datetime-local"
                  defaultValue={toDatetimeLocal(pending.endedAt)}
                  min={toDatetimeLocal(pending.createdAt)}
                  onChange={(e) =>
                    dispatch(updatePendingTimes({ endedAt: fromDatetimeLocal(e.target.value) }))
                  }
                />
              </label>
              <button className="review-edit-done-btn" type="button" onClick={() => setEditing(false)}>
                Listo
              </button>
            </>
          ) : (
            <>
              <div className="review-time-row">
                <span className="review-time-label">Inicio</span>
                <span className="review-time-value">{formatDisplay(pending.createdAt)}</span>
              </div>
              <div className="review-time-row">
                <span className="review-time-label">Fin</span>
                <span className="review-time-value">{formatDisplay(pending.endedAt)}</span>
              </div>
              <button className="review-edit-btn" type="button" onClick={() => setEditing(true)}>
                Ajustar tiempos
              </button>
            </>
          )}
        </div>
      </section>

      <footer className="neura-screen-footer">
        <button className="neura-btn-primary" type="button" onClick={handleContinue}>
          Continuar
        </button>
      </footer>
    </main>
  )
}

export default ReviewScreen
