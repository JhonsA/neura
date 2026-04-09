import { useEffect } from 'react'

import { useMigraineStore } from '@/features/migraine/store'

export function useInitMigraine() {
  const loadEvents = useMigraineStore((state) => state.loadEvents)

  useEffect(() => {
    loadEvents()
  }, [loadEvents])
}
