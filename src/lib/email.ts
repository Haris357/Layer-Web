// Stricter email validation than a one-liner regex: requires a sane local
// part and a real domain with a 2+ char TLD (catches "a@b", "x@y.", etc.).
const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export function isValidEmail(value: string): boolean {
  const e = value.trim()
  if (e.length < 6 || e.length > 254) return false
  if (!EMAIL_RE.test(e)) return false
  // TLD must be at least 2 letters.
  const tld = e.slice(e.lastIndexOf('.') + 1)
  return /^[a-zA-Z]{2,}$/.test(tld)
}

const COMMON_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'proton.me',
  'protonmail.com',
  'aol.com',
  'live.com',
  'msn.com',
]

function distance(a: string, b: string): number {
  const dp: number[] = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0] ?? 0
    dp[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j] ?? 0
      dp[j] =
        a[i - 1] === b[j - 1]
          ? prev
          : 1 + Math.min(prev, dp[j] ?? 0, dp[j - 1] ?? 0)
      prev = tmp
    }
  }
  return dp[b.length] ?? 0
}

// Suggests a corrected address if the domain looks like a typo of a common
// provider (e.g. "gmial.com" → "gmail.com"). Returns null if nothing close.
export function suggestEmail(value: string): string | null {
  const e = value.trim().toLowerCase()
  const at = e.lastIndexOf('@')
  if (at < 1) return null
  const domain = e.slice(at + 1)
  if (domain.length < 3 || domain.includes(' ')) return null
  if (COMMON_DOMAINS.includes(domain)) return null

  let best: string | null = null
  let bestDist = 3
  for (const d of COMMON_DOMAINS) {
    const dist = distance(domain, d)
    if (dist > 0 && dist < bestDist) {
      bestDist = dist
      best = d
    }
  }
  if (!best) return null
  return value.trim().slice(0, at + 1) + best
}
