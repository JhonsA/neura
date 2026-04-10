export type Location =
  | 'left'
  | 'right'
  | 'both'
  | 'temple'
  | 'eye'
  | 'forehead'
  | 'back'
  | 'whole'

export type Medication = 'ibuprofen' | 'paracetamol' | 'triptan' | 'other'

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
  /** false = took nothing, array = what was taken, null = skipped */
  medication: Medication[] | false | null
  /** free text when 'other' is selected */
  medicationOther: string | null
}
