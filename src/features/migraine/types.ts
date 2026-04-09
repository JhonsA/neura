export type MigraineEvent = {
  id: string
  /** ISO timestamp — when the crisis started */
  createdAt: string
  /** ISO timestamp — when the crisis ended (optional for legacy events) */
  endedAt?: string
  intensity: number
  location: 'left' | 'right' | 'back'
}
