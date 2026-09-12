const OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Top Rated' }
]

export default function SortControl({ value, onChange }) {
  return (
    <label className="flex items-center gap-2">
      <span className="eyebrow text-ink-muted">Sort</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="eyebrow appearance-none rounded-full border border-rule bg-bg py-2 pl-3.5 pr-8 text-ink outline-none transition-colors hover:border-ink"
        >
          {OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </label>
  )
}
