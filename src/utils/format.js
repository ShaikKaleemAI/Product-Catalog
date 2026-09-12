export function formatPrice(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '$0.00'
  return `$${n.toFixed(2)}`
}

export function formatIndex(position, total) {
  const width = String(Math.max(total, 1)).length < 3 ? 3 : String(total).length
  const num = String(position).padStart(width, '0')
  const den = String(total).padStart(width, '0')
  return `No. ${num} / ${den}`
}

export function titleCase(str) {
  if (!str) return ''
  return str
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function truncate(str, max = 90) {
  if (!str) return ''
  if (str.length <= max) return str
  return `${str.slice(0, max).trimEnd()}…`
}
