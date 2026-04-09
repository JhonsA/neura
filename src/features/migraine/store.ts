import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { MigraineEvent } from './types'

type MigraineStore = {
  events: MigraineEvent[]
  addEvent: (event: MigraineEvent) => void
}

export const useMigraineStore = create<MigraineStore>()(
  persist(
    (set) => ({
      events: [],
      addEvent: (event) =>
        set((state) => ({ events: [event, ...state.events] })),
    }),
    { name: 'neura-events' },
  ),
)
