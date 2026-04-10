import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { commitEvent } from '@/features/migraine/migraineSlice'
import type { Location, Medication } from '@/features/migraine/types'
import WaveBackground from './WaveBackground'

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

/** Current local datetime in the format required by datetime-local inputs */
function nowLocal(): string {
  return toDatetimeLocal(new Date().toISOString())
}

const INTENSITIES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

const INTENSITY_LABEL: Record<number, string> = {
  1: 'Apenas perceptible', 2: 'Muy leve',    3: 'Leve',
  4: 'Moderado',           5: 'Molesto',      6: 'Fuerte',
  7: 'Muy fuerte',         8: 'Intenso',      9: 'Muy intenso',
  10: 'Insoportable',
}

const LOCATIONS_SIDE: { value: Location; label: string }[] = [
  { value: 'left',  label: 'Izquierda' },
  { value: 'right', label: 'Derecha'   },
  { value: 'both',  label: 'Ambos'     },
]

const LOCATIONS_ZONE: { value: Location; label: string }[] = [
  { value: 'temple',   label: 'Sien'            },
  { value: 'eye',      label: 'Ojo'             },
  { value: 'forehead', label: 'Frente'          },
  { value: 'back',     label: 'Parte posterior' },
  { value: 'whole',    label: 'Toda la cabeza'  },
]

function intensityColor(n: number): string {
  if (n <= 3) return '#6db8a0'
  if (n <= 6) return '#d4a84b'
  return '#c26b6b'
}

const MEDICATIONS: { value: Medication; label: string }[] = [
  { value: 'ibuprofen',   label: 'Ibuprofeno'  },
  { value: 'paracetamol', label: 'Paracetamol' },
  { value: 'triptan',     label: 'Triptán'     },
  { value: 'other',       label: 'Otro'        },
]

// ─── Component ────────────────────────────────────────────────────────────────

function ReviewScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id }   = useParams<{ id?: string }>()
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo ?? '/'
  const dispatch = useAppDispatch()
  const pending  = useAppSelector((state) => state.migraine.pendingEvent)
  const event    = useAppSelector((state) =>
    id ? (state.migraine.events.find((e) => e.id === id) ?? null) : null
  )

  // Source of truth: existing event for edits, pending times for new records
  const source = id ? event : pending

  // All form state is local — Redux is only touched on final Guardar
  const [startTime,   setStartTime]   = useState(source?.createdAt ?? '')
  const [endTime,     setEndTime]     = useState(source?.endedAt   ?? '')
  const [intensity,   setIntensity]   = useState<number>(
    (source && 'intensity' in source && source.intensity != null) ? source.intensity : 5
  )
  const [locations, setLocations] = useState<Location[]>(
    (source && 'location' in source && Array.isArray(source.location)) ? source.location : []
  )
  const [tookMed, setTookMed] = useState<boolean | null>(
    (source && 'medication' in source)
      ? source.medication === null ? null
        : source.medication === false ? false
        : true
      : null
  )
  const [medications, setMedications] = useState<Medication[]>(
    (source && 'medication' in source && Array.isArray(source.medication)) ? source.medication : []
  )
  const [medOther, setMedOther] = useState(
    (source && 'medicationOther' in source) ? (source.medicationOther ?? '') : ''
  )

  const SIDE_VALUES = LOCATIONS_SIDE.map((l) => l.value)

  const toggleLocation = (loc: Location) => {
    const isSide = SIDE_VALUES.includes(loc)
    setLocations((prev) => {
      if (isSide) {
        // Single-select: replace any existing side, keep zones
        const withoutSides = prev.filter((l) => !SIDE_VALUES.includes(l))
        return prev.includes(loc) ? withoutSides : [...withoutSides, loc]
      }
      // Zone logic: "whole" is exclusive within zones
      const withoutZones = prev.filter((l) => SIDE_VALUES.includes(l))
      if (loc === 'whole') {
        // selecting "whole" clears all other zones
        return prev.includes('whole') ? withoutZones : [...withoutZones, 'whole']
      }
      // selecting any other zone clears "whole"
      const zonesWithoutWhole = prev.filter((l) => l !== 'whole' && !SIDE_VALUES.includes(l))
      return zonesWithoutWhole.includes(loc)
        ? [...withoutZones, ...zonesWithoutWhole.filter((l) => l !== loc)]
        : [...withoutZones, ...zonesWithoutWhole, loc]
    })
  }

  const toggleMedication = (med: Medication) => {
    setMedications((prev) =>
      prev.includes(med) ? prev.filter((m) => m !== med) : [...prev, med]
    )
  }

  // ── Date validation ───────────────────────────────────────────────────────
  type FieldState = { msg: string; level: 'error' | 'warning' | '' }

  function validateDates(start: string, end: string): { startState: FieldState; endState: FieldState } {
    const now     = Date.now()
    const startTs = Date.parse(start)
    const endTs   = Date.parse(end)
    let startState: FieldState = { msg: '', level: '' }
    let endState:   FieldState = { msg: '', level: '' }

    if (startTs > now)
      startState = { msg: 'Parece que esta fecha es futura', level: 'error' }
    if (endTs > now)
      endState = { msg: 'Parece que esta fecha es futura', level: 'error' }
    if (!startState.msg && !endState.msg && startTs > endTs)
      endState = { msg: 'Parece que el fin ocurre antes del inicio', level: 'error' }
    if (!startState.msg && !endState.msg && startTs === endTs)
      endState = { msg: '¿La migraña duró menos de un minuto?', level: 'warning' }

    return { startState, endState }
  }

  const { startState, endState } = validateDates(startTime, endTime)
  const hasDateErrors = startState.level === 'error' || endState.level === 'error'

  // Guard: redirect on direct URL access without valid state
  useEffect(() => {
    if (id && !event) navigate(returnTo, { replace: true })
    if (!id && !pending) navigate(returnTo, { replace: true })
  }, [id, event, pending, navigate, returnTo])

  if (id ? !event : !pending) return null

  const isEdit = Boolean(id)
  const duration = formatDuration(startTime, endTime)

  const handleSave = () => {
    if (hasDateErrors) return
    const hasOtherText = medOther.trim().length > 0
    const effectiveMeds = medications.filter((m) => m !== 'other' || hasOtherText)
    const medicationPayload = tookMed === null ? null
      : tookMed === false ? false
      : effectiveMeds.length > 0 ? effectiveMeds : null
    dispatch(commitEvent({
      id,
      createdAt: startTime,
      endedAt: endTime,
      intensity,
      location: locations.length > 0 ? locations : null,
      medication: medicationPayload,
      medicationOther: hasOtherText ? medOther.trim() : null,
    }))
    navigate(returnTo, { replace: true })
  }

  const handleSkip = () => {
    if (!isEdit) {
      // New record: commit with no details (clears pendingEvent)
      dispatch(commitEvent({ createdAt: startTime, endedAt: endTime, intensity: null, location: null, medication: null, medicationOther: null }))
    }
    // For edits: just navigate away — no Redux state to clean up
    navigate(returnTo, { replace: true })
  }

  return (
    <main className="neura-screen" aria-label="Registrar migraña">
      <header className="neura-screen-header">
        <button className="neura-back-btn" onClick={handleSkip} type="button" aria-label="Volver sin guardar detalles">
          <ArrowLeft size={20} strokeWidth={1.8} />
        </button>
      </header>

      <section className="neura-screen-body">
        {/* ── Hero ── */}
        <div className="neura-screen-hero">
          <h1 className="neura-screen-title">Detalles de la migraña</h1>
        </div>

        {/* ── Formulario unificado ── */}
        <div className="review-form">

          <div className="review-form-section">
            <span className="review-form-label">Duración del episodio</span>
            <div className="review-times">
              <label className="review-time-row">
                <span className="review-time-label">Inicio</span>
                <input
                  className={`review-time-input${startState.level ? ` review-time-input--${startState.level}` : ''}`}
                  type="datetime-local"
                  defaultValue={toDatetimeLocal(startTime)}
                  max={nowLocal()}
                  onChange={(e) => setStartTime(fromDatetimeLocal(e.target.value))}
                />
                {startState.msg && (
                  <span className={`review-time-feedback review-time-feedback--${startState.level}`}>
                    {startState.msg}
                  </span>
                )}
              </label>
              <label className="review-time-row">
                <span className="review-time-label">Fin</span>
                <input
                  className={`review-time-input${endState.level ? ` review-time-input--${endState.level}` : ''}`}
                  type="datetime-local"
                  defaultValue={toDatetimeLocal(endTime)}
                  max={nowLocal()}
                  onChange={(e) => setEndTime(fromDatetimeLocal(e.target.value))}
                />
                {endState.msg && (
                  <span className={`review-time-feedback review-time-feedback--${endState.level}`}>
                    {endState.msg}
                  </span>
                )}
              </label>
              {!hasDateErrors && duration && (
                <p className="review-duration-inline">Duración: <strong>{duration}</strong></p>
              )}
            </div>
          </div>

          <div className="review-form-divider" />

          <div className="review-form-section">
            <span className="review-form-label">¿Qué tan fuerte?</span>
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
              <span className="form-intensity-current" style={{ color: intensityColor(intensity) }}>{INTENSITY_LABEL[intensity]}</span>
            </div>
          </div>

          <div className="review-form-divider" />

          <div className="review-form-section">
            <span className="review-form-label">¿Dónde sentiste el dolor?</span>

            <span className="review-form-sublabel">Lado</span>
            <div className="form-location-grid" role="group" aria-label="Lado del dolor">
              {LOCATIONS_SIDE.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={`form-location-btn${locations.includes(value) ? ' form-location-btn--active' : ''}`}
                  onClick={() => toggleLocation(value)}
                  aria-pressed={locations.includes(value)}
                >
                  {label}
                </button>
              ))}
            </div>

            <span className="review-form-sublabel" style={{ marginTop: '10px' }}>Zona</span>
            <div className="form-location-grid" role="group" aria-label="Zona del dolor">
              {LOCATIONS_ZONE.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={`form-location-btn${locations.includes(value) ? ' form-location-btn--active' : ''}`}
                  onClick={() => toggleLocation(value)}
                  aria-pressed={locations.includes(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="review-form-divider" />

          <div className="review-form-section">
            <span className="review-form-label">¿Tomaste algo?</span>
            <div className="form-yesno-group" role="group" aria-label="¿Tomaste medicación?">
              <button
                type="button"
                className={`form-yesno-btn${tookMed === true ? ' form-yesno-btn--active' : ''}`}
                onClick={() => setTookMed(true)}
                aria-pressed={tookMed === true}
              >
                Sí
              </button>
              <button
                type="button"
                className={`form-yesno-btn${tookMed === false ? ' form-yesno-btn--active' : ''}`}
                onClick={() => setTookMed(false)}
                aria-pressed={tookMed === false}
              >
                No
              </button>
            </div>

            {tookMed === true && (
              <div className="form-med-section">
                <span className="review-form-sublabel">¿Qué tomaste?</span>
                <div className="form-location-grid" role="group" aria-label="Medicación tomada">
                  {MEDICATIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      className={`form-location-btn${medications.includes(value) ? ' form-location-btn--active' : ''}`}
                      onClick={() => toggleMedication(value)}
                      aria-pressed={medications.includes(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {medications.includes('other') && (
                  <input
                    className="form-med-other-input"
                    type="text"
                    placeholder="Escribir medicamento..."
                    value={medOther}
                    onChange={(e) => setMedOther(e.target.value)}
                    maxLength={80}
                  />
                )}
              </div>
            )}
          </div>

        </div>
      </section>

      <footer className="neura-screen-footer">
        <button className="neura-btn-primary" type="button" onClick={handleSave} disabled={hasDateErrors}>
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
