import { Zap, X } from 'lucide-react'

import { useMigraineStore } from '@/features/migraine/store'

function MigraineButton() {
  const activeSession = useMigraineStore((state) => state.activeSession)
  const startSession  = useMigraineStore((state) => state.startSession)
  const endSession    = useMigraineStore((state) => state.endSession)

  const isCrisis = activeSession !== null

  const handleClick = () => {
    if (isCrisis) {
      endSession()
    } else {
      startSession()
    }
  }

  return (
    <button
      className="migraine-cta"
      onClick={handleClick}
      type="button"
    >
      <span className="migraine-cta-icon-wrap" aria-hidden="true">
        {isCrisis
          ? <X className="migraine-cta-icon" strokeWidth={2.2} />
          : <Zap className="migraine-cta-icon" strokeWidth={2.2} />}
      </span>
      <span className="migraine-cta-title">
        {isCrisis ? 'Terminar' : 'Tengo migraña'}
      </span>
      <span className="migraine-cta-subtitle">
        {isCrisis ? 'Finalizar registro' : 'Registrar ahora'}
      </span>
    </button>
  )
}

export default MigraineButton
