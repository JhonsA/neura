import { Zap } from 'lucide-react'

import { useMigraineStore } from '@/features/migraine/store'

function MigraineButton() {
  const addEvent = useMigraineStore((state) => state.addEvent)

  const handleClick = () => {
    addEvent({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      intensity: 5,
      location: 'left',
    })
  }

  return (
    <button className="migraine-cta" onClick={handleClick} type="button">
      <span className="migraine-cta-icon-wrap" aria-hidden="true">
        <Zap className="migraine-cta-icon" strokeWidth={2.2} />
      </span>
      <span className="migraine-cta-title">Tengo migraña</span>
      <span className="migraine-cta-subtitle">Registrar ahora</span>
    </button>
  )
}

export default MigraineButton
