export type MigraineEvent = {
  id: string
  createdAt: string
  intensity: number
  location: 'left' | 'right' | 'back'
}
