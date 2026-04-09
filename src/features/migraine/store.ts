import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { MigraineEvent } from './types'

type MigraineStore = {
  events: MigraineEvent[]
  /** ISO timestamp of the ongoing session, null when idle */
  activeSession: string | null
  addEvent: (event: MigraineEvent) => void
  startSession: () => void
  endSession: () => void
}

export const useMigraineStore = create<MigraineStore>()(
  persist(
    (set) => ({
      events: [],
      activeSession: null,
      addEvent: (event) =>
        set((state) => ({ events: [event, ...state.events] })),
      startSession: () =>
        set({ activeSession: new Date().toISOString() }),
      endSession: () =>
        set((state) => {
          if (!state.activeSession) return {}
          const event: MigraineEvent = {
            id: crypto.randomUUID(),
            createdAt: state.activeSession,
            endedAt: new Date().toISOString(),
            intensity: 5,
            location: 'left',
          }
          return { events: [event, ...state.events], activeSession: null }
        }),
    }),
    { name: 'neura-events' },
  ),
)
