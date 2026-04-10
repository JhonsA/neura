export type Location =
  | 'left'
  | 'right'
  | 'both'
  | 'temple'
  | 'eye'
  | 'forehead'
  | 'back'
  | 'whole'

export type MigraineEvent = {
  id: string
  /** ISO timestamp — when the crisis started */
  createdAt: string
  /** ISO timestamp — when the crisis ended (optional for legacy events) */
  endedAt?: string
  /** null when the user skipped the form */
  intensity: number | null
  /** null when the user skipped the form */
  location: Location[] | null
}
