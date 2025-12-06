/**
 * Build avatar URL with optional cache busting
 * Handles both full URLs and relative paths from Django backend
 */
export function buildAvatarUrl(path?: string | null, cacheKey?: string | number | null) {
  if (!path) return undefined

  // If it's already a full URL, use it directly
  const base = path

  if (!cacheKey) return base
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}t=${encodeURIComponent(String(cacheKey))}`
}
