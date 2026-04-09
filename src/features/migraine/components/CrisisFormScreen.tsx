import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { commitEvent } from '@/features/migraine/migraineSlice'
import type { MigraineEvent } from '@/features/migraine/types'

type Location = MigraineEvent['location']

const LOCATIONS: { value: Location; label: string }[] = [
  { value: 'left',  label: 'Izquierda' },
  { value: 'right', label: 'Derecha'   },
  { value: 'back',  label: 'Posterior' },
]

const INTENSITIES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

function CrisisFormScreen() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const pending  = useAppSelector((state) => state.migraine.pendingEvent)

  const [intensity, setIntensity] = useState<number>(5)
  const [location,  setLocation]  = useState<Location>('left')

  useEffect(() => {
    if (!pending) navigate('/', { replace: true })
  }, [pending, navigate])

  if (!pending) return null

  const handleSave = () => {
    dispatch(commitEvent({ intensity, location }))
    navigate('/', { replace: true })
  }

  const handleSkip = () => {
    dispatch(commitEvent({ intensity: 5, location: 'left' }))
    navigate('/', { replace: true })
  }

  return (
    <main className="neura-screen" aria-label="Formulario post-crisis">
      <header className="neura-screen-header">
        <button className="neura-back-btn" onClick={() => navigate('/review')} type="button" aria-label="Volver">
          <ArrowLeft size={20} strokeWidth={1.8} />
        </button>
      </header>

      <section className="neura-screen-body">
        <h1 className="neura-screen-title">¿Cómo fue la migraña?</h1>
        <p className="neura-screen-subtitle">Opcional — puedes omitirlo ahora</p>

        {/* Intensidad */}
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

        {/* Ubicación */}
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
      </section>

      <footer className="neura-screen-footer">
        <button className="neura-btn-primary" type="button" onClick={handleSave}>
          Guardar
        </button>
        <button className="neura-btn-ghost" type="button" onClick={handleSkip}>
          Omitir por ahora
        </button>
      </footer>
    </main>
  )
}

export default CrisisFormScreen
