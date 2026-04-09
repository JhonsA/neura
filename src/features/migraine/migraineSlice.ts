import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { MigraineEvent } from './types'

// ─── State shape ─────────────────────────────────────────────────────────────

/** Times held during the review + form flow, before final commit */
export type PendingEvent = {
  /** Set when editing an already-saved event; absent when recording a new one */
  id?:        string
  createdAt:  string
  endedAt:    string
  /** Pre-filled when editing an existing event */
  intensity?: number
  location?:  MigraineEvent['location']
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
     * If pendingEvent.id is set, updates the existing event instead of creating a new one.
     * Clears pendingEvent. Navigation to / is handled by the caller.
     */
    commitEvent(
      state,
      action: PayloadAction<Pick<MigraineEvent, 'intensity' | 'location'>>,
    ) {
      if (!state.pendingEvent) return
      const { id, createdAt, endedAt } = state.pendingEvent
      if (id) {
        // Edit mode: update the existing event in place
        const idx = state.events.findIndex((e) => e.id === id)
        if (idx !== -1) {
          state.events[idx] = { id, createdAt, endedAt, ...action.payload }
        }
      } else {
        // New event
        const event: MigraineEvent = {
          id:        crypto.randomUUID(),
          createdAt,
          endedAt,
          intensity: action.payload.intensity,
          location:  action.payload.location,
        }
        state.events.unshift(event)
      }
      state.pendingEvent = null
    },

    /** Cancels the review/edit flow and discards the pending event. */
    cancelReview(state) {
      state.pendingEvent = null
    },

    /**
     * Loads an existing saved event into pendingEvent so the user can
     * edit its times and intensity/location via the Review + Form screens.
     */
    loadEventForEdit(state, action: PayloadAction<string>) {
      const event = state.events.find((e) => e.id === action.payload)
      if (!event) return
      state.pendingEvent = {
        id:        event.id,
        createdAt: event.createdAt,
        endedAt:   event.endedAt ?? new Date().toISOString(),
        intensity: event.intensity,
        location:  event.location,
      }
    },
  },
})

export const {
  startSession,
  beginReview,
  updatePendingTimes,
  commitEvent,
  cancelReview,
  loadEventForEdit,
} = migraineSlice.actions

export default migraineSlice.reducer
