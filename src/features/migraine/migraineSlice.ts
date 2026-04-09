import { createSlice } from '@reduxjs/toolkit'

import type { MigraineEvent } from './types'

// ─── State shape ─────────────────────────────────────────────────────────────

type MigraineState = {
  /** All completed migraine events, newest first */
  events: MigraineEvent[]
  /** ISO timestamp of the ongoing session; null when idle */
  activeSession: string | null
}

const initialState: MigraineState = {
  events: [],
  activeSession: null,
}

// ─── Slice ────────────────────────────────────────────────────────────────────

export const migraineSlice = createSlice({
  name: 'migraine',
  initialState,
  reducers: {
    /**
     * Marks the start of a new crisis and records the current timestamp.
     */
    startSession(state) {
      state.activeSession = new Date().toISOString()
    },

    /**
     * Ends the active crisis, saves a MigraineEvent with start + end time,
     * and resets activeSession to null.
     * Does nothing if there is no active session.
     */
    endSession(state) {
      if (!state.activeSession) return

      const event: MigraineEvent = {
        id: crypto.randomUUID(),
        createdAt: state.activeSession,
        endedAt:   new Date().toISOString(),
        // Intensity and location will be filled in the post-crisis form (future)
        intensity: 5,
        location:  'left',
      }

      state.events.unshift(event)
      state.activeSession = null
    },
  },
})

export const { startSession, endSession } = migraineSlice.actions

export default migraineSlice.reducer
