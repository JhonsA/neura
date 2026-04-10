import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock } from 'lucide-react'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { cancelReview, commitEvent } from '@/features/migraine/migraineSlice'
import type { MigraineEvent } from '@/features/migraine/types'
import WaveBackground from './WaveBackground'

type Location = MigraineEvent['location']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(startIso: string, endIso: string): string {
  const secs = Math.max(0, Math.round((Date.parse(endIso) - Date.parse(startIso)) / 1000))
  const h    = Math.floor(secs / 3600)
  const m    = Math.floor((secs % 3600) / 60)
  if (h > 0 && m > 0) return `${h}h ${m}min`
  if (h > 0)          return `${h}h`
  if (m > 0)          return `${m} min`
  return `${secs} seg`
}

function toDatetimeLocal(iso: string): string {
  const d      = new Date(iso)
  const offset = d.getTimezoneOffset() * 60_000
  return new Date(d.getTime() - offset).toISOString().slice(0, 16)
}

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

const INTENSITIES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

const LOCATIONS: { value: Location; label: string }[] = [
  { value: 'left',  label: 'Izquierda' },
  { value: 'right', label: 'Derecha'   },
  { value: 'back',  label: 'Posterior' },
]

// ─── Component ────────────────────────────────────────────────────────────────

function ReviewScreen() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const pending  = useAppSelector((state) => state.migraine.pendingEvent)

  // All form state is local — Redux is only touched on final Guardar or cancel
  const [startTime,   setStartTime]   = useState(pending?.createdAt ?? '')
  const [endTime,     setEndTime]     = useState(pending?.endedAt   ?? '')
  const [intensity,   setIntensity]   = useState<number>(pending?.intensity ?? 5)
  const [location,    setLocation]    = useState<Location>(pending?.location ?? 'left')
  const [editingTime, setEditingTime] = useState(false)

  // Guard: redirect if there's no pending event (e.g. direct URL access)
  useEffect(() => {
    if (!pending) navigate('/', { replace: true })
  }, [pending, navigate])

  if (!pending) return null

  const isEdit   = Boolean(pending.id)
  const duration = formatDuration(startTime, endTime)

  const handleCancel = () => {
    dispatch(cancelReview())
    navigate('/', { replace: true })
  }

  const handleSave = () => {
    dispatch(commitEvent({ createdAt: startTime, endedAt: endTime, intensity, location }))
    navigate('/', { replace: true })
  }

  const handleSkip = () => {
    // Use the original times from the pending event — ignore any local edits
    dispatch(commitEvent({ createdAt: pending.createdAt, endedAt: pending.endedAt, intensity: null, location: null }))
    navigate('/', { replace: true })
  }

  return (
    <main className="neura-screen" aria-label="Registrar migraña">
      <header className="neura-screen-header">
        <button className="neura-back-btn" onClick={handleSkip} type="button" aria-label="Volver sin guardar detalles">
          <ArrowLeft size={20} strokeWidth={1.8} />
        </button>
      </header>

      <section className="neura-screen-body">
        {/* ── Hero: icono + título + duración ── */}
        <div className="neura-screen-hero">
          <div className="review-icon-wrap" aria-hidden="true">
            <Clock size={24} strokeWidth={1.5} />
          </div>
          <h1 className="neura-screen-title">{isEdit ? 'Editar migraña' : 'Migraña registrada'}</h1>
          <p className="review-duration" aria-label={`Duración: ${duration}`}>
            <span className="review-duration-label">Duración</span>
            <span className="review-duration-value">{duration}</span>
          </p>
        </div>

        {/* ── Tiempos ── */}
        <div className="review-card">
          <span className="review-card-label">Tiempos</span>
          <div className="review-times">
            {editingTime ? (
              <>
                <label className="review-time-row">
                  <span className="review-time-label">Inicio</span>
                  <input
                    className="review-time-input"
                    type="datetime-local"
                    defaultValue={toDatetimeLocal(startTime)}
                    max={toDatetimeLocal(endTime)}
                    onChange={(e) => setStartTime(fromDatetimeLocal(e.target.value))}
                  />
                </label>
                <label className="review-time-row">
                  <span className="review-time-label">Fin</span>
                  <input
                    className="review-time-input"
                    type="datetime-local"
                    defaultValue={toDatetimeLocal(endTime)}
                    min={toDatetimeLocal(startTime)}
                    onChange={(e) => setEndTime(fromDatetimeLocal(e.target.value))}
                  />
                </label>
                <button className="review-edit-done-btn" type="button" onClick={() => setEditingTime(false)}>
                  Listo
                </button>
              </>
            ) : (
              <>
                <div className="review-time-row">
                  <span className="review-time-label">Inicio</span>
                  <span className="review-time-value">{formatDisplay(startTime)}</span>
                </div>
                <div className="review-time-row">
                  <span className="review-time-label">Fin</span>
                  <span className="review-time-value">{formatDisplay(endTime)}</span>
                </div>
                <button className="review-edit-btn" type="button" onClick={() => setEditingTime(true)}>
                  Ajustar tiempos
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Intensidad ── */}
        <div className="review-card">
          <div className="form-field">
            <span className="form-field-label">Intensidad</span>
            <div className="form-intensity-grid" role="group" aria-label="Intensidad del dolor">
              {INTENSITIES.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`form-intensity-btn${intensity === n ? ' form-intensity-btn--active' : ''}`}
                  onClick={() => setIntensity(n)}
                  aria-pressed={intensity === n}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="form-intensity-labels">
              <span>Leve</span>
              <span>Severa</span>
            </div>
          </div>
        </div>

        {/* ── Ubicación ── */}
        <div className="review-card">
          <div className="form-field">
            <span className="form-field-label">Ubicación</span>
            <div className="form-location-grid" role="group" aria-label="Ubicación del dolor">
              {LOCATIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={`form-location-btn${location === value ? ' form-location-btn--active' : ''}`}
                  onClick={() => setLocation(value)}
                  aria-pressed={location === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="neura-screen-footer">
        <button className="neura-btn-primary" type="button" onClick={handleSave}>
          Guardar
        </button>
        <button className="neura-btn-ghost" type="button" onClick={handleSkip}>
          Omitir
        </button>
      </footer>

      <WaveBackground />
    </main>
  )
}

export default ReviewScreen
