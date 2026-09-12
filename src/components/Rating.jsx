export default function Rating({ rate = 0, count = 0, size = 'sm' }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i + 1 <= Math.round(rate)
    return filled
  })
  const dim = size === 'lg' ? 15 : 11

  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${rate} out of 5 from ${count} reviews`}>
      <div className="flex items-center gap-0.5">
        {stars.map((filled, i) => (
          <svg
            key={i}
            width={dim}
            height={dim}
            viewBox="0 0 24 24"
            fill={filled ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.6"
            className={filled ? 'text-ink' : 'text-rule'}
          >
            <polygon points="12 2 15.09 8.63 22 9.24 16.5 14.14 18.18 21 12 17.27 5.82 21 7.5 14.14 2 9.24 8.91 8.63 12 2" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-ink-muted">({count})</span>
    </div>
  )
}
