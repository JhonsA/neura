import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { MigraineEvent } from './types'

// ─── State shape ─────────────────────────────────────────────────────────────

/** Times held during the review + form flow, before final commit */
export type PendingEvent = {
  createdAt: string
  endedAt:   string
}

type MigraineState = {
  /** All completed migraine events, newest first */
  events: MigraineEvent[]
  /** ISO timestamp of the ongoing session; null when idle */
  activeSession: string | null
  /** Filled when user presses "Terminar" — awaiting review/form confirmation */
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

    /** Updates start and/or end time during the review step. */
    updatePendingTimes(state, action: PayloadAction<Partial<PendingEvent>>) {
      if (!state.pendingEvent) return
      state.pendingEvent = { ...state.pendingEvent, ...action.payload }
    },

    /**
     * Commits the pending event to the log with the form data (intensity + location).
     * Clears pendingEvent. Navigation to / is handled by the caller.
     */
    commitEvent(
      state,
      action: PayloadAction<Pick<MigraineEvent, 'intensity' | 'location'>>,
    ) {
      if (!state.pendingEvent) return
      const event: MigraineEvent = {
        id:        crypto.randomUUID(),
        createdAt: state.pendingEvent.createdAt,
        endedAt:   state.pendingEvent.endedAt,
        intensity: action.payload.intensity,
        location:  action.payload.location,
      }
      state.events.unshift(event)
      state.pendingEvent = null
    },

    /** Cancels the review flow and discards the pending event. */
    cancelReview(state) {
      state.pendingEvent = null
    },
  },
})

export const {
  startSession,
  beginReview,
  updatePendingTimes,
  commitEvent,
  cancelReview,
} = migraineSlice.actions

export default migraineSlice.reducer
