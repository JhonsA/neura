import { create } from 'zustand'

import type { MigraineEvent } from './types'

type MigraineStore = {
  events: MigraineEvent[]
  addEvent: (event: MigraineEvent) => void
  loadEvents: () => void
}

const STORAGE_KEY = 'neura-events'

export const useMigraineStore = create<MigraineStore>((set) => ({
  events: [],
  addEvent: (event) => {
    set((state) => {
      const updatedEvents = [event, ...state.events]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents))
      return { events: updatedEvents }
    })
  },
  loadEvents: () => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      set({ events: [] })
      return
    }

    try {
      const parsed = JSON.parse(raw) as MigraineEvent[]
      set({ events: parsed })
    } catch {
      set({ events: [] })
    }
  },
}))
