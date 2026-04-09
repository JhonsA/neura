import { CloudLightning, CloudSun } from 'lucide-react'

import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { endSession, startSession } from '@/features/migraine/migraineSlice'

function MigraineButton() {
  const dispatch     = useAppDispatch()
  const activeSession = useAppSelector((state) => state.migraine.activeSession)

  const isCrisis = activeSession !== null

  const handleClick = () => {
    if (isCrisis) {
      dispatch(endSession())
    } else {
      dispatch(startSession())
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
          ? <CloudSun className="migraine-cta-icon" strokeWidth={2.2} />
          : <CloudLightning className="migraine-cta-icon" strokeWidth={2.2} />}
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
