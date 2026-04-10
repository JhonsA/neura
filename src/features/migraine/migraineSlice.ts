import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { MigraineEvent } from './types'

// ─── State shape ─────────────────────────────────────────────────────────────

/** Times held during the new-record flow, before final commit */
export type PendingEvent = {
  createdAt: string
  endedAt:   string
}

type MigraineState = {
  /** All completed migraine events, newest first */
  events: MigraineEvent[]
  /** ISO timestamp of the ongoing session; null when idle */
  activeSession: string | null
  /** Set when user presses "Terminar" — holds session times until committed */
  pendingEvent: PendingEvent | null
}

const initialState: MigraineState = {
  events:        [],
  activeSession: null,
  pendingEvent:  null,
}

// ─── Slice ────────────────────────────────────────────────────────────────────

export const migraineSlice = createSlice({
  name: 'migraine',
  initialState,
  reducers: {
    /** Marks the start of a new crisis and records the current timestamp. */
    startSession(state) {
      state.activeSession = new Date().toISOString()
      state.pendingEvent  = null   // discard any abandoned pending event
    },

    /**
     * Ends the active crisis and moves the times to pendingEvent so the user
     * can review / edit them before committing.
     * Navigation to /review is handled by the caller.
     */
    beginReview(state) {
      if (!state.activeSession) return
      state.pendingEvent  = { createdAt: state.activeSession, endedAt: new Date().toISOString() }
      state.activeSession = null
    },

    /**
     * Commits form data to the events list.
     * - No `id` in payload → new record (requires pendingEvent for times, clears it).
     * - `id` present → update existing record directly (no pendingEvent involved).
     */
    commitEvent(
      state,
      action: PayloadAction<{
        id?: string
        createdAt: string
        endedAt: string
        intensity: number | null
        location: MigraineEvent['location']
        medication: MigraineEvent['medication']
        medicationOther: MigraineEvent['medicationOther']
      }>,
    ) {
      const { id, createdAt, endedAt, intensity, location, medication, medicationOther } = action.payload
      if (id) {
        const idx = state.events.findIndex((e) => e.id === id)
        if (idx !== -1) {
          state.events[idx] = { id, createdAt, endedAt, intensity, location, medication, medicationOther }
        }
      } else {
        if (!state.pendingEvent) return
        state.events.unshift({ id: crypto.randomUUID(), createdAt, endedAt, intensity, location, medication, medicationOther })
        state.pendingEvent = null
      }
    },

    /** Discards the pending new-record event (user cancels before committing). */
    cancelReview(state) {
      state.pendingEvent = null
    },
  },
})

export const {
  startSession,
  beginReview,
  commitEvent,
  cancelReview,
} = migraineSlice.actions

export default migraineSlice.reducer
