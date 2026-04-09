import { ShieldCheck } from 'lucide-react'

import {
  LastMigraineCard,
  MigraineButton,
  WaveBackground,
  useInitMigraine,
} from '@/features/migraine'
import { useMigraineStore } from '@/features/migraine/store'

const WAVE_ANIMATED = import.meta.env.VITE_WAVE_ANIMATED === 'true'

function App() {
  useInitMigraine()

  const isCrisis = useMigraineStore((state) => state.activeSession !== null)

  return (
    <main className="neura-shell" aria-label="Registro de migrañas">
      <section className="neura-hero">
        <h1 className="neura-title">Neura</h1>
        <span className="neura-title-deco" aria-hidden="true">
          <span className="deco-dot" />
          <svg viewBox="0 0 48 12" className={`deco-wave${WAVE_ANIMATED ? ' deco-wave--animated' : ''}${isCrisis ? ' deco-wave--crisis' : ''}`} aria-hidden="true">
            <path
              d="M2 9 C10 3, 18 11, 24 6 C30 1, 38 9, 46 4"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          <span className="deco-dot" />
        </span>
        <p className="neura-subtitle">
          Registra tus migrañas en segundos,{' '}
          entiende tus patrones y recupera el control.
        </p>
      </section>

      <section className="neura-actions" aria-label="Acciones principales">
        <MigraineButton />
        <LastMigraineCard />
      </section>

      <WaveBackground />

      <p className="neura-privacy">
        <ShieldCheck size={14} strokeWidth={1.8} aria-hidden="true" />
        Tus datos son privados y seguros
      </p>
    </main>
  )
}

export default App
