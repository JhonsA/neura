import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

const INTENSITIES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

const INTENSITY_LABEL: Record<number, string> = {
  1: 'Apenas perceptible', 2: 'Muy leve',    3: 'Leve',
  4: 'Moderado',           5: 'Molesto',      6: 'Fuerte',
  7: 'Muy fuerte',         8: 'Intenso',      9: 'Muy intenso',
  10: 'Insoportable',
}

const LOCATIONS: { value: Location; label: string }[] = [
  { value: 'left',     label: 'Izquierda'      },
  { value: 'right',    label: 'Derecha'         },
  { value: 'both',     label: 'Ambos lados'     },
  { value: 'temple',   label: 'Sien'            },
  { value: 'eye',      label: 'Ojo'             },
  { value: 'forehead', label: 'Frente'          },
  { value: 'back',     label: 'Parte posterior' },
  { value: 'whole',    label: 'Toda la cabeza'  },
]

const MEDICATIONS: { value: Medication; label: string }[] = [
  { value: 'ibuprofen',   label: 'Ibuprofeno'  },
  { value: 'paracetamol', label: 'Paracetamol' },
  { value: 'triptan',     label: 'Triptán'     },
  { value: 'other',       label: 'Otro'        },
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
  const [locations,      setLocations]      = useState<Location[]>(pending?.location ?? [])
  const [tookMed,        setTookMed]        = useState<boolean | null>(
    pending?.medication === undefined || pending?.medication === null ? null
    : pending.medication === false ? false
    : true
  )
  const [medications,    setMedications]    = useState<Medication[]>(
    Array.isArray(pending?.medication) ? pending.medication : []
  )
  const [medOther,       setMedOther]       = useState(pending?.medicationOther ?? '')

  const toggleLocation = (loc: Location) => {
    setLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    )
  }

  const toggleMedication = (med: Medication) => {
    setMedications((prev) =>
      prev.includes(med) ? prev.filter((m) => m !== med) : [...prev, med]
    )
  }

  // Guard: redirect if there's no pending event (e.g. direct URL access)
  useEffect(() => {
    if (!pending) navigate('/', { replace: true })
  }, [pending, navigate])

  if (!pending) return null

  const isEdit   = Boolean(pending.id)
  const duration = formatDuration(startTime, endTime)

  const handleSave = () => {
    const medicationPayload = tookMed === null ? null
      : tookMed === false ? false
      : medications.length > 0 ? medications : null
    dispatch(commitEvent({
      createdAt: startTime,
      endedAt: endTime,
      intensity,
      location: locations.length > 0 ? locations : null,
      medication: medicationPayload,
      medicationOther: medications.includes('other') ? medOther || null : null,
    }))
    navigate('/', { replace: true })
  }

  const handleSkip = () => {
    dispatch(commitEvent({ createdAt: pending.createdAt, endedAt: pending.endedAt, intensity: null, location: null, medication: null, medicationOther: null }))
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
        {/* ── Hero ── */}
        <div className="neura-screen-hero">
          <h1 className="neura-screen-title">{isEdit ? 'Editar migraña' : 'Migraña registrada'}</h1>
          <p className="review-duration-badge" aria-label={`Duración: ${duration}`}>{duration}</p>
        </div>

        {/* ── Formulario unificado ── */}
        <div className="review-form">

          <div className="review-form-section">
            <span className="review-form-label">Duración del episodio</span>
            <div className="review-times">
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
              <span className="form-intensity-current">{INTENSITY_LABEL[intensity]}</span>
            </div>
          </div>

          <div className="review-form-divider" />

          <div className="review-form-section">
            <span className="review-form-label">¿Dónde sentiste el dolor?</span>
            <div className="form-location-grid" role="group" aria-label="Ubicación del dolor">
              {LOCATIONS.map(({ value, label }) => (
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
