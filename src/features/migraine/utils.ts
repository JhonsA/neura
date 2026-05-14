// ─── Shared formatting helpers for migraine components ───────────────────────

export function formatDuration(startIso: string, endIso?: string): string {
  if (!endIso) return ''
  const secs = Math.max(0, Math.round((Date.parse(endIso) - Date.parse(startIso)) / 1000))
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  if (h > 0 && m > 0) return `${h}h ${m}min`
  if (h > 0) return `${h}h`
  if (m > 0) return `${m} min`
  return `${secs} seg`
}

export function intensityColor(n: number | null): string {
  if (n === null) return 'var(--c-text-muted)'
  if (n <= 3) return '#6db8a0'
  if (n <= 6) return '#d4a84b'
  return '#c26b6b'
}
