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

export type SleepHours   = '<5h' | '5-6h' | '7-8h' | '+8h'
export type SleepQuality = 'bad' | 'regular' | 'good'
export type StressLevel  = 'low' | 'medium' | 'high'
export type Hydration    = 'low' | 'normal' | 'high'
export type Meal         = 'breakfast' | 'lunch' | 'dinner'
export type Trigger =
  | 'sleep'
  | 'stress'
  | 'dehydration'
  | 'skipped_meal'
  | 'screens_light'
  | 'noise'
  | 'smells'
  | 'exercise'
  | 'weather'
  | 'menstrual'
  | 'alcohol'
  | 'unknown'
  | 'other'

export type MigraineContext = {
  sleepHours:       SleepHours | null
  sleepQuality:     SleepQuality | null
  stressLevel:      StressLevel | null
  hydration:        Hydration | null
  skippedMeals:     boolean | null
  skippedMealsList: Meal[]
  trigger:          Trigger | null
  triggerOther:     string | null
}

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
  /** optional context filled after the episode */
  context: MigraineContext | null
}
